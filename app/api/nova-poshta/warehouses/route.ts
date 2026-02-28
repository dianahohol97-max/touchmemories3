import { NextResponse } from 'next/server';
import { searchWarehouses } from '@/lib/nova-poshta';

// GET /api/nova-poshta/warehouses?cityRef=...
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const cityRef = searchParams.get('cityRef');

        if (!cityRef) {
            return NextResponse.json({ error: 'cityRef required' }, { status: 400 });
        }

        const result = await searchWarehouses(cityRef);
        return NextResponse.json({ data: result.data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
