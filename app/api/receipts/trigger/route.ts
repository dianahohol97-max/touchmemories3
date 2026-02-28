import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createReceipt } from '@/lib/checkbox';

// Internal trigger endpoint for creating Checkbox receipt automatically
export async function POST(req: Request) {
    try {
        // 1. Authorization strictly from our internal server role key
        const authHeader = req.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { orderId } = await req.json();
        if (!orderId) {
            return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
        }

        // 2. Fetch Order and Items
        const { data: order, error: orderErr } = await supabaseAdmin
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();

        if (orderErr || !order) {
            throw new Error('Order not found or db error');
        }

        const { data: items, error: itemsErr } = await supabaseAdmin
            .from('order_items')
            .select('*')
            .eq('order_id', orderId);

        if (itemsErr || !items || items.length === 0) {
            throw new Error('Order items not found');
        }

        // 3. Format items for Checkbox API
        const receiptItems = items.map(item => ({
            good: {
                code: item.product_id, // unique ID of the product
                name: item.product_name,
                price: item.unit_price_uah // already in kopiiky
            },
            quantity: item.quantity * 1000 // Checkbox expects 1000 for 1 piece (typically fractional quantity standard)
        }));

        // Add Delivery cost if business model charges it
        // For this example, assuming delivery is paid separately to Nova Poshta
        // or handled within product mapping.

        // 4. Call Checkbox to create receipt
        // amount in kopiiky, email for customer copy
        const checkboxRes = await createReceipt(receiptItems, order.total_amount_uah, order.customer_email);

        // Receipt is created. Extract details to save in DB.
        const receiptId = checkboxRes.id;
        const fiscalNumber = checkboxRes.fiscal_number;
        const receiptUrl = checkboxRes.receipt_url || `https://my.checkbox.ua/receipts/sell/${receiptId}`;

        // 5. Store in Receipts table
        await supabaseAdmin.from('receipts').insert({
            order_id: orderId,
            fiscal_number: fiscalNumber,
            amount_uah: order.total_amount_uah,
            sent_to_email: order.customer_email,
            checkbox_receipt_url: receiptUrl
        });

        // 6. Send transactional email (Resend)
        // Normally we'd use Resend API directly here:
        // import { Resend } from 'resend';
        // const resend = new Resend(process.env.RESEND_API_KEY!);
        // await resend.emails.send({ ... });

        console.log(`Receipt created successfully for Order ${orderId}`);
        return NextResponse.json({ success: true, receiptId });
    } catch (error: any) {
        console.error('Receipt generation error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
