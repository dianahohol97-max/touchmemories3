import crypto from 'crypto';

const MONOBANK_TOKEN = process.env.MONOBANK_TOKEN!;
const WEBHOOK_URL = process.env.MONOBANK_WEBHOOK_URL!;
const WEBHOOK_SECRET = process.env.MONOBANK_WEBHOOK_SECRET!;

export interface CreateInvoiceRequest {
    amount: number; // in kopiiky
    ccy?: number;   // 980 = UAH
    merchantPaymInfo: {
        reference: string; // our Supabase order_id
        destination: string;
        basketOrder: Array<{
            name: string;
            qty: number;
            sum: number; // in kopiiky
            icon?: string;
            unit?: string;
        }>;
    };
    redirectUrl?: string;
}

export async function createInvoice(req: CreateInvoiceRequest) {
    const url = 'https://api.monobank.ua/api/merchant/invoice/create';
    const payload = {
        ...req,
        ccy: req.ccy || 980,
        webHookUrl: WEBHOOK_URL,
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Token': MONOBANK_TOKEN,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Monobank invoice error: ${response.status} ${errorBody}`);
    }

    return response.json(); // { invoiceId: "...", pageUrl: "..." }
}

let cachedPubKey: crypto.KeyObject | null = null;

export async function getMonobankPubKey(): Promise<crypto.KeyObject> {
    if (cachedPubKey) return cachedPubKey;

    const res = await fetch('https://api.monobank.ua/bank/sync');

    if (!res.ok) {
        throw new Error(`Failed to fetch Mono pubkey from /bank/sync: ${res.status}`);
    }

    const data = await res.json();
    const base64Key = data.serverPubKey || data.key;

    if (!base64Key) {
        throw new Error('No public key found in Monobank response');
    }

    const pubKeyBuffer = Buffer.from(base64Key, 'base64');

    // Monobank returns a raw secp256k1 uncompressed public key.
    // Node's crypto library requires standard SPKI format.
    // We prepend the standard ASN.1 SPKI header for secp256k1 uncompressed.
    const spkiHeader = Buffer.from('3056301006072a8648ce3d020106052b8104000a034200', 'hex');
    const spkiBuffer = Buffer.concat([spkiHeader, pubKeyBuffer]);

    cachedPubKey = crypto.createPublicKey({
        key: spkiBuffer,
        format: 'der',
        type: 'spki',
    });

    return cachedPubKey;
}

export async function verifyWebhookSignature(xSignBase64: string, bodyBuffer: Buffer): Promise<boolean> {
    try {
        const pubKey = await getMonobankPubKey();
        const signature = Buffer.from(xSignBase64, 'base64');

        return crypto.verify(
            'SHA256',
            bodyBuffer,
            pubKey,
            signature
        );
    } catch (err) {
        console.error('Signature verification error:', err);
        return false;
    }
}
