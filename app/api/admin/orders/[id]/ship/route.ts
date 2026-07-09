import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getOrderById } from '@/lib/orders';
import { getStoreSettings } from '@/lib/settings';
import { createShipment } from '@/lib/delhivery';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// POST /api/admin/orders/:id/ship -> admin only, creates a Delhivery shipment for this order
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const order = await getOrderById(id);
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  if (order.waybill) return NextResponse.json({ error: 'This order already has a shipment.' }, { status: 400 });

  const settings = await getStoreSettings();
  if (!settings.delhiveryEnabled) {
    return NextResponse.json({ error: 'Delhivery shipping is not enabled. Enable it in Store Settings first.' }, { status: 400 });
  }
  if (!settings.delhiveryApiKey || !settings.delhiveryClientName || !settings.delhiveryPickupName ||
      !settings.delhiveryPickupAddress || !settings.delhiveryPickupCity || !settings.delhiveryPickupPincode || !settings.delhiveryPickupPhone) {
    return NextResponse.json({ error: 'Delhivery is not fully configured. Complete all fields in Store Settings.' }, { status: 400 });
  }

  try {
    const result = await createShipment(
      {
        apiKey: settings.delhiveryApiKey,
        clientName: settings.delhiveryClientName,
        pickupName: settings.delhiveryPickupName,
        pickupAddress: settings.delhiveryPickupAddress,
        pickupCity: settings.delhiveryPickupCity,
        pickupPincode: settings.delhiveryPickupPincode,
        pickupPhone: settings.delhiveryPickupPhone,
      },
      {
        orderId: order.id,
        customerName: order.shippingName,
        customerPhone: order.shippingPhone,
        addressLine1: order.shippingLine1,
        addressLine2: order.shippingLine2,
        city: order.shippingCity,
        state: order.shippingState,
        pincode: order.shippingPincode,
        paymentMode: order.paymentMethod === 'COD' ? 'COD' : 'Prepaid',
        codAmount: order.paymentMethod === 'COD' ? order.totalAmount : 0,
        totalAmount: order.totalAmount,
        productsDesc: order.items.map(i => i.productName).join(', ').slice(0, 500),
        quantity: order.items.reduce((sum, i) => sum + i.quantity, 0),
      }
    );

    const updated = await prisma.order.update({
      where: { id },
      data: {
        waybill: result.waybill,
        trackingUrl: result.trackingUrl,
        courierStatus: 'Manifested',
        shippedAt: new Date(),
        status: 'SHIPPED',
      },
    });

    revalidatePath(`/admin/orders/${id}`);
    revalidatePath('/admin/orders');
    revalidatePath(`/myaccount/orders/${id}`);

    return NextResponse.json({ order: updated });
  } catch (err: any) {
    console.error('Create Delhivery shipment error:', err);
    return NextResponse.json({ error: err.message ?? 'Failed to create shipment with Delhivery.' }, { status: 500 });
  }
}
