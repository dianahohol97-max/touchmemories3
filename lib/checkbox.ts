const API_URL = process.env.CHECKBOX_API_URL!;
const LOGIN = process.env.CHECKBOX_LOGIN!;
const PASSWORD = process.env.CHECKBOX_PASSWORD!;

// Best practice: Store token in Redis/DB to avoid logging in on every request
// For MVP, we'll keep it in memory within the Vercel isolate (will refresh on cold start)
let _cachedToken: string | null = null;

async function getToken(): Promise<string> {
    if (_cachedToken) return _cachedToken;

    const res = await fetch(`${API_URL}/cashier/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: LOGIN, password: PASSWORD })
    });

    if (!res.ok) throw new Error('Checkbox auth failed');
    const data = await res.json();
    _cachedToken = data.access_token;
    return _cachedToken!;
}

// Wrapper to handle 401s
async function apiCall(method: string, endpoint: string, body?: any) {
    let token = await getToken();
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    let res = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined
    });

    if (res.status === 401 || res.status === 403) {
        _cachedToken = null; // force refresh
        token = await getToken();
        headers['Authorization'] = `Bearer ${token}`;
        res = await fetch(`${API_URL}${endpoint}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined
        });
    }

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Checkbox api error: ${res.status} ${err}`);
    }
    return res.json();
}

export async function ensureShiftOpen() {
    const current = await apiCall('GET', '/shifts/current');
    if (current?.status === 'OPENED') return current;
    return apiCall('POST', '/shifts');
}

export interface ReceiptItem {
    good: {
        code: string;
        name: string;
        price: number; // kopiiky
    };
    quantity: number; // multiplying factor (e.g. 1000 for 1 piece if fractional, Checkbox expects integers usually, see docs)
}

export async function createReceipt(items: ReceiptItem[], paymentCardKopiiky: number, email: string) {
    await ensureShiftOpen();

    const payload = {
        goods: items,
        delivery: { email }, // send copy to customer
        payments: [
            {
                type: 'CASHLESS',
                value: paymentCardKopiiky
            }
        ]
    };

    return apiCall('POST', '/receipts/sell', payload);
}
