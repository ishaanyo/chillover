import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createOrder, getOrdersByUserId } from '@/lib/orders';
import { getStoreSettings } from '@/lib/settings';

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
      items, subtotal, shippingFee, totalAmount, paymentId, paymentMethod,
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

    const order = await createOrder({
      userId: session.user.id,
      items,
      subtotal: Number(subtotal) || 0,
      shippingFee: Number(shippingFee) || 0,
      totalAmount: Number(totalAmount) || 0,
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

    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    console.error('Create order error:', err);
    return NextResponse.json({ error: 'Failed to create order.' }, { status: 500 });
  }
}
