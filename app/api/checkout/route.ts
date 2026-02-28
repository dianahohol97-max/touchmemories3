import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createInvoice } from '@/lib/monobank';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            customerName,
            customerEmail,
            customerPhone,
            deliveryMethod,
            deliveryCityRef,
            deliveryWarehouseRef,
            deliveryAddressLabel,
            items, // array of { productId, name, price, quantity, customization }
            totalAmount // in kopiiky
        } = body;

        // Basic validation
        if (!items || items.length === 0 || !totalAmount) {
            return NextResponse.json({ error: 'Invalid cart' }, { status: 400 });
        }

        // 1. Create order in Supabase (status 'pending')
        const { data: order, error: orderErr } = await supabaseAdmin
            .from('orders')
            .insert({
                customer_name: customerName,
                customer_email: customerEmail,
                customer_phone: customerPhone,
                delivery_method: deliveryMethod,
                delivery_city_ref: deliveryCityRef,
                delivery_warehouse_ref: deliveryWarehouseRef,
                delivery_address_label: deliveryAddressLabel,
                total_amount_uah: totalAmount,
                status: 'pending'
            })
            .select('id')
            .single();

        if (orderErr) {
            console.error(orderErr);
            return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
        }

        const orderId = order.id;

        // 2. Insert order items
        const orderItems = items.map((item: any) => ({
            order_id: orderId,
            product_id: item.productId,
            product_name: item.name,
            quantity: item.quantity,
            unit_price_uah: item.price,
            customization: item.customization || {}
        }));

        const { error: itemsErr } = await supabaseAdmin.from('order_items').insert(orderItems);
        if (itemsErr) {
            console.error(itemsErr);
            return NextResponse.json({ error: 'Failed to save items' }, { status: 500 });
        }

        // 3. Call Monobank to create invoice
        const monoRequest = {
            amount: totalAmount,
            merchantPaymInfo: {
                reference: orderId,
                destination: `Оплата замовлення #${orderId.substring(0, 8)}`,
                basketOrder: items.map((i: any) => ({
                    name: i.name,
                    qty: i.quantity,
                    sum: i.price * i.quantity
                }))
            },
            redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/order/${orderId}`
        };

        const monoRes = await createInvoice(monoRequest);

        // 4. Update order with invoice ID
        await supabaseAdmin
            .from('orders')
            .update({ payment_invoice_id: monoRes.invoiceId })
            .eq('id', orderId);

        // 5. Return the payment page URL so the client can redirect
        return NextResponse.json({ pageUrl: monoRes.pageUrl, orderId });

    } catch (error: any) {
        console.error('Checkout error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
