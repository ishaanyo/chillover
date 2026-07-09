import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { validateCoupon } from '@/lib/coupons';

// POST /api/coupons/validate -> logged-in customer checks a code against their cart subtotal
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ valid: false, message: 'You must be logged in to apply a coupon.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { code, subtotal } = body;

    if (!code || subtotal === undefined) {
      return NextResponse.json({ valid: false, message: 'Coupon code and subtotal are required.' }, { status: 400 });
    }

    const result = await validateCoupon(code, Number(subtotal));
    return NextResponse.json(result);
  } catch (err) {
    console.error('Validate coupon error:', err);
    return NextResponse.json({ valid: false, message: 'Failed to validate coupon.' }, { status: 500 });
  }
}
