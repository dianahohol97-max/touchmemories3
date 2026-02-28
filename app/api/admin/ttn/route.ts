import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createTTN } from '@/lib/nova-poshta';

export async function POST(req: Request) {
    try {
        // 1. Verify Authentication (using Supabase Auth token passed from client)
        const authHeader = req.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authErr } = await supabaseAdmin.auth.getUser(token);

        if (authErr || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Role check (Optional but recommended)
        // if (user.user_metadata?.role !== 'admin') { ... }

        const { orderId } = await req.json();
        if (!orderId) {
            return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
        }

        // 2. Fetch Order Details
        const { data: order, error: orderErr } = await supabaseAdmin
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();

        if (orderErr || !order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        if (order.delivery_method !== 'nova_poshta') {
            return NextResponse.json({ error: 'Order does not use Nova Poshta' }, { status: 400 });
        }

        // 3. Create TTN
        const ttnRes = await createTTN({
            orderId: order.id,
            recipientName: order.customer_name,
            recipientPhone: order.customer_phone,
            cityRef: order.delivery_city_ref,
            warehouseRef: order.delivery_warehouse_ref,
            weightKg: 0.5, // Default or fetch from products
            declaredCostUah: Math.floor(order.total_amount_uah / 100) // NP expects UAH, not kopiiky
        });

        const ttnNumber = ttnRes.data[0].IntDocNumber;

        // 4. Save to DB
        await supabaseAdmin.from('ttn_records').insert({
            order_id: order.id,
            ttn_number: ttnNumber,
            recipient_name: order.customer_name,
            recipient_phone: order.customer_phone,
            city_ref: order.delivery_city_ref,
            warehouse_ref: order.delivery_warehouse_ref,
            declared_value_uah: order.total_amount_uah
        });

        // 5. Update Order Status
        await supabaseAdmin
            .from('orders')
            .update({ status: 'shipped' })
            .eq('id', order.id);

        return NextResponse.json({ success: true, ttnNumber });

    } catch (error: any) {
        console.error('TTN generation error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
