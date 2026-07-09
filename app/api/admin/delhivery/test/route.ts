import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { testConnection } from '@/lib/delhivery';

// POST /api/admin/delhivery/test -> admin only, verifies API key + client name work
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { apiKey, clientName, pickupName, pickupAddress, pickupCity, pickupPincode, pickupPhone } = body;

    if (!apiKey || !clientName) {
      return NextResponse.json({ success: false, error: 'API key and client name are required.' }, { status: 400 });
    }

    await testConnection({ apiKey, clientName, pickupName, pickupAddress, pickupCity, pickupPincode, pickupPhone });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Delhivery test connection error:', err);
    return NextResponse.json({ success: false, error: err.message ?? 'Connection test failed.' }, { status: 400 });
  }
}
