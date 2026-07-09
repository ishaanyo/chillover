import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getOrderById } from '@/lib/orders';
import { getStoreSettings } from '@/lib/settings';
import { trackShipment } from '@/lib/delhivery';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// GET /api/admin/orders/:id/track -> admin only, pulls live status from Delhivery and saves it
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const order = await getOrderById(id);
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  if (!order.waybill) return NextResponse.json({ error: 'This order has no shipment yet.' }, { status: 400 });

  const settings = await getStoreSettings();
  if (!settings.delhiveryApiKey) {
    return NextResponse.json({ error: 'Delhivery API key is not configured.' }, { status: 400 });
  }

  try {
    const result = await trackShipment(settings.delhiveryApiKey, order.waybill);

    const updated = await prisma.order.update({
      where: { id },
      data: { courierStatus: result.status ?? order.courierStatus },
    });

    revalidatePath(`/admin/orders/${id}`);
    revalidatePath(`/myaccount/orders/${id}`);

    return NextResponse.json({ courierStatus: updated.courierStatus, details: result });
  } catch (err: any) {
    console.error('Track Delhivery shipment error:', err);
    return NextResponse.json({ error: err.message ?? 'Failed to fetch tracking status.' }, { status: 500 });
  }
}
