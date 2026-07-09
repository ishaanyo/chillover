import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getCoupons, createCoupon } from '@/lib/coupons';

// GET /api/coupons -> admin only, list all coupons
export async function GET() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const coupons = await getCoupons();
  return NextResponse.json({ coupons });
}

// POST /api/coupons -> admin only, create a coupon
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { code, type, value, minOrderValue, maxDiscount, expiresAt, usageLimit } = body;

    if (!code || !type || value === undefined || value === null) {
      return NextResponse.json({ error: 'Code, type, and value are required.' }, { status: 400 });
    }
    if (!['PERCENT', 'FLAT'].includes(type)) {
      return NextResponse.json({ error: 'Type must be PERCENT or FLAT.' }, { status: 400 });
    }
    if (type === 'PERCENT' && (value < 1 || value > 100)) {
      return NextResponse.json({ error: 'Percent discount must be between 1 and 100.' }, { status: 400 });
    }

    const coupon = await createCoupon({
      code,
      type,
      value: Number(value),
      minOrderValue: minOrderValue ? Number(minOrderValue) : 0,
      maxDiscount: maxDiscount ? Number(maxDiscount) : null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      usageLimit: usageLimit ? Number(usageLimit) : null,
    });

    return NextResponse.json({ coupon }, { status: 201 });
  } catch (err: any) {
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'A coupon with this code already exists.' }, { status: 409 });
    }
    console.error('Create coupon error:', err);
    return NextResponse.json({ error: 'Failed to create coupon.' }, { status: 500 });
  }
}
