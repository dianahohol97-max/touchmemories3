import { NextResponse } from 'next/server';
import { searchCities } from '@/lib/nova-poshta';

// GET /api/nova-poshta/cities?query=Київ
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('query') || '';

        if (query.length < 2) {
            return NextResponse.json({ data: [] });
        }

        const result = await searchCities(query);
        return NextResponse.json({ data: result.data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
