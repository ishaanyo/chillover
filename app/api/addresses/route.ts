import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getAddressesByUserId, createAddress } from '@/lib/addresses';

// GET /api/addresses -> the logged-in customer's saved addresses
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const addresses = await getAddressesByUserId(session.user.id);
  return NextResponse.json({ addresses });
}

// POST /api/addresses -> save a new address
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { label, name, phone, line1, line2, city, state, pincode, isDefault } = body;

    if (!name || !phone || !line1 || !city || !state || !pincode) {
      return NextResponse.json({ error: 'All required fields must be filled.' }, { status: 400 });
    }

    const address = await createAddress(session.user.id, {
      label: label || 'Home', name, phone, line1, line2, city, state, pincode, isDefault: Boolean(isDefault),
    });

    return NextResponse.json({ address }, { status: 201 });
  } catch (err) {
    console.error('Create address error:', err);
    return NextResponse.json({ error: 'Failed to save address.' }, { status: 500 });
  }
}
