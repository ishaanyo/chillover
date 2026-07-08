import { prisma } from './prisma';

interface OrderItemInput {
  productId?: string;
  productName: string;
  productImage?: string;
  productSlug?: string;
  size: string;
  quantity: number;
  price: number;
}

interface CreateOrderInput {
  userId: string;
  items: OrderItemInput[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: 'RAZORPAY' | 'COD';
  paymentId?: string;
  shippingName: string;
  shippingPhone: string;
  shippingLine1: string;
  shippingLine2?: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
}

// Create a new order (called right after a successful Razorpay payment, or immediately for COD)
export async function createOrder(data: CreateOrderInput) {
  const { items, paymentMethod, ...orderData } = data;
  return prisma.order.create({
    data: {
      ...orderData,
      paymentMethod,
      status: paymentMethod === 'COD' ? 'PENDING' : 'CONFIRMED',
      items: { create: items },
    },
    include: { items: true },
  });
}

// Get all orders belonging to a specific customer
export async function getOrdersByUserId(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });
}

// Get a single order (includes basic customer info — used by admin detail view)
export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      user: { select: { id: true, name: true, email: true } },
    },
  });
}

// Get every order in the store (admin order management)
export async function getAllOrders() {
  return prisma.order.findMany({
    include: {
      items: true,
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

// Update order status (admin only — enforced at the API layer)
export async function updateOrderStatus(id: string, status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED') {
  return prisma.order.update({
    where: { id },
    data: { status },
  });
}
