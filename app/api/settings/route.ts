import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getStoreSettings, updateCodEnabled } from '@/lib/settings';

// GET /api/settings -> public, used by checkout to know if COD is available
export async function GET() {
  const settings = await getStoreSettings();
  return NextResponse.json({ codEnabled: settings.codEnabled });
}

// PUT /api/settings -> admin only, toggle COD
export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    if (typeof body.codEnabled !== 'boolean') {
      return NextResponse.json({ error: 'codEnabled must be a boolean.' }, { status: 400 });
    }
    const settings = await updateCodEnabled(body.codEnabled);
    return NextResponse.json({ codEnabled: settings.codEnabled });
  } catch (err) {
    console.error('Update settings error:', err);
    return NextResponse.json({ error: 'Failed to update settings.' }, { status: 500 });
  }
}
