import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getStoreSettings, updateDelhiveryConfig } from '@/lib/settings';

// GET /api/admin/delhivery -> admin only, full config (includes API key — never expose via public /api/settings)
export async function GET() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const settings = await getStoreSettings();
  return NextResponse.json({
    delhiveryEnabled: settings.delhiveryEnabled,
    delhiveryApiKey: settings.delhiveryApiKey ?? '',
    delhiveryClientName: settings.delhiveryClientName ?? '',
    delhiveryPickupName: settings.delhiveryPickupName ?? '',
    delhiveryPickupAddress: settings.delhiveryPickupAddress ?? '',
    delhiveryPickupCity: settings.delhiveryPickupCity ?? '',
    delhiveryPickupPincode: settings.delhiveryPickupPincode ?? '',
    delhiveryPickupPhone: settings.delhiveryPickupPhone ?? '',
  });
}

// PUT /api/admin/delhivery -> admin only, save config
export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const settings = await updateDelhiveryConfig({
      delhiveryEnabled: Boolean(body.delhiveryEnabled),
      delhiveryApiKey: body.delhiveryApiKey || null,
      delhiveryClientName: body.delhiveryClientName || null,
      delhiveryPickupName: body.delhiveryPickupName || null,
      delhiveryPickupAddress: body.delhiveryPickupAddress || null,
      delhiveryPickupCity: body.delhiveryPickupCity || null,
      delhiveryPickupPincode: body.delhiveryPickupPincode || null,
      delhiveryPickupPhone: body.delhiveryPickupPhone || null,
    });
    return NextResponse.json({ success: true, delhiveryEnabled: settings.delhiveryEnabled });
  } catch (err) {
    console.error('Update Delhivery config error:', err);
    return NextResponse.json({ error: 'Failed to save Delhivery settings.' }, { status: 500 });
  }
}
