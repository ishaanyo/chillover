import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { updateCoupon, deleteCoupon } from '@/lib/coupons';

// PUT /api/coupons/:id -> admin only, update a coupon (e.g. toggle active)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const data: any = {};
    if (typeof body.isActive === 'boolean') data.isActive = body.isActive;
    if (body.value !== undefined) data.value = Number(body.value);
    if (body.minOrderValue !== undefined) data.minOrderValue = Number(body.minOrderValue);
    if (body.maxDiscount !== undefined) data.maxDiscount = body.maxDiscount ? Number(body.maxDiscount) : null;
    if (body.expiresAt !== undefined) data.expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;
    if (body.usageLimit !== undefined) data.usageLimit = body.usageLimit ? Number(body.usageLimit) : null;

    const coupon = await updateCoupon(id, data);
    return NextResponse.json({ coupon });
  } catch (err) {
    console.error('Update coupon error:', err);
    return NextResponse.json({ error: 'Failed to update coupon.' }, { status: 500 });
  }
}

// DELETE /api/coupons/:id -> admin only
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    await deleteCoupon(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete coupon.' }, { status: 500 });
  }
}
