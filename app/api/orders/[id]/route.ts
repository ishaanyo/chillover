import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getOrderById, updateOrderStatus } from '@/lib/orders';
import { revalidatePath } from 'next/cache';

// GET /api/orders/:id -> order owner or an admin can view
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const order = await getOrderById(id);
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  const isOwner = order.userId === session.user.id;
  const isAdmin = session.user.role === 'ADMIN';
  if (!isOwner && !isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  return NextResponse.json({ order });
}

// PUT /api/orders/:id -> admin only, updates order status
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const validStatuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
    }

    const order = await updateOrderStatus(id, body.status);
    revalidatePath('/admin/orders');
    revalidatePath('/myaccount/orders');

    return NextResponse.json({ order });
  } catch (err) {
    console.error('Update order status error:', err);
    return NextResponse.json({ error: 'Failed to update order.' }, { status: 500 });
  }
}
