import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyWebhookSignature } from '@/lib/monobank';

// Webhooks from Monobank are POST requests
export async function POST(req: Request) {
    try {
        // 1. Verify Signature
        const signature = req.headers.get('x-sign');
        if (!signature) {
            return NextResponse.json({ error: 'Missing X-Sign header' }, { status: 400 });
        }

        const bodyText = await req.text();
        const bodyBuffer = Buffer.from(bodyText, 'utf-8');

        const isValid = await verifyWebhookSignature(signature, bodyBuffer);
        if (!isValid) {
            console.warn('Invalid Monobank signature');
            // Monobank expects 200 OK even for failed signatures to stop retrying, 
            // but returning 400 is safer if we want them to retry. Let's stick to 400 for bad signs.
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        // 2. Parse payload
        const payload = JSON.parse(bodyText);
        const { reference: orderId, status } = payload;

        if (!orderId) {
            return NextResponse.json({ error: 'No reference in payload' }, { status: 400 });
        }

        // 3. Update Order in Supabase
        // We only care if it changed to 'success' or 'failure'
        if (status === 'success') {
            const { data: order, error } = await supabaseAdmin
                .from('orders')
                .update({ status: 'paid' })
                .eq('id', orderId)
                .select()
                .single();

            if (error) {
                console.error('Supabase update error:', error);
                return NextResponse.json({ error: 'Database error' }, { status: 500 });
            }

            // 4. Trigger Checkbox Fiscalization ASYNC
            // We don't await this because Monobank needs a 200 OK fast.
            // In Vercel, if using Edge functions, waitUntil() is required. 
            // For Node.js runtime, floating promises usually finish before lambda dies, but not guaranteed.
            // We will spawn the request to an internal `/api/receipts/trigger` endpoint 
            // to let a separate lambda handle it, or just call the function if not serverless.

            const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
            fetch(`${appUrl}/api/receipts/trigger`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Use an internal secret to prevent unauthorized triggers
                    'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
                },
                body: JSON.stringify({ orderId })
            }).catch(err => console.error('Failed to trigger receipt async:', err));
        } else if (status === 'failure') {
            await supabaseAdmin
                .from('orders')
                .update({ status: 'cancelled' })
                .eq('id', orderId);
        }

        // 5. Always acknowledge Monobank quickly
        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Monobank webhook handler error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
