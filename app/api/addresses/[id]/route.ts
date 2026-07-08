import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getAddressById, updateAddress, deleteAddress } from '@/lib/addresses';

// PUT /api/addresses/:id -> update an address (owner only)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const existing = await getAddressById(id);
  if (!existing) return NextResponse.json({ error: 'Address not found' }, { status: 404 });
  if (existing.userId !== session.user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const body = await req.json();
    const address = await updateAddress(id, session.user.id, body);
    return NextResponse.json({ address });
  } catch (err) {
    console.error('Update address error:', err);
    return NextResponse.json({ error: 'Failed to update address.' }, { status: 500 });
  }
}

// DELETE /api/addresses/:id -> remove an address (owner only)
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const existing = await getAddressById(id);
  if (!existing) return NextResponse.json({ error: 'Address not found' }, { status: 404 });
  if (existing.userId !== session.user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    await deleteAddress(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete address.' }, { status: 500 });
  }
}
