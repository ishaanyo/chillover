import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createOrder, getOrdersByUserId } from '@/lib/orders';
import { getStoreSettings } from '@/lib/settings';
import { validateCoupon, redeemCoupon } from '@/lib/coupons';

// GET /api/orders -> the logged-in customer's own orders
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const orders = await getOrdersByUserId(session.user.id);
  return NextResponse.json({ orders });
}

// POST /api/orders -> create a new order (called right after Razorpay payment succeeds)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'You must be logged in to place an order.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      items, subtotal, shippingFee, couponCode, paymentId, paymentMethod,
      shippingName, shippingPhone, shippingLine1, shippingLine2,
      shippingCity, shippingState, shippingPincode,
    } = body;

    if (!items?.length) {
      return NextResponse.json({ error: 'Order must contain at least one item.' }, { status: 400 });
    }
    if (!shippingName || !shippingPhone || !shippingLine1 || !shippingCity || !shippingState || !shippingPincode) {
      return NextResponse.json({ error: 'Complete shipping address is required.' }, { status: 400 });
    }

    const method = paymentMethod === 'COD' ? 'COD' : 'RAZORPAY';
    if (method === 'RAZORPAY' && !paymentId) {
      return NextResponse.json({ error: 'Payment ID is required for prepaid orders.' }, { status: 400 });
    }

    // If COD is selected, verify it's currently allowed store-wide
    if (method === 'COD') {
      const settings = await getStoreSettings();
      if (!settings.codEnabled) {
        return NextResponse.json({ error: 'Cash on Delivery is currently unavailable.' }, { status: 400 });
      }
    }

    const safeSubtotal = Number(subtotal) || 0;
    const safeShipping = Number(shippingFee) || 0;

    // Never trust the client's discount figure — re-validate the coupon against the real subtotal
    let discountAmount = 0;
    let validatedCouponCode: string | undefined;
    if (couponCode) {
      const result = await validateCoupon(couponCode, safeSubtotal);
      if (!result.valid) {
        return NextResponse.json({ error: result.message ?? 'Coupon is no longer valid.' }, { status: 400 });
      }
      discountAmount = result.discount ?? 0;
      validatedCouponCode = result.coupon?.code;
    }

    const totalAmount = Math.max(0, safeSubtotal + safeShipping - discountAmount);

    const order = await createOrder({
      userId: session.user.id,
      items,
      subtotal: safeSubtotal,
      shippingFee: safeShipping,
      couponCode: validatedCouponCode,
      discountAmount,
      totalAmount,
      paymentMethod: method,
      paymentId,
      shippingName,
      shippingPhone,
      shippingLine1,
      shippingLine2,
      shippingCity,
      shippingState,
      shippingPincode,
    });

    if (validatedCouponCode) {
      await redeemCoupon(validatedCouponCode);
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    console.error('Create order error:', err);
    return NextResponse.json({ error: 'Failed to create order.' }, { status: 500 });
  }
}

