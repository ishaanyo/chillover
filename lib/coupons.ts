import { prisma } from './prisma';

export async function getCoupons() {
  return prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function getCouponByCode(code: string) {
  return prisma.coupon.findUnique({ where: { code: code.trim().toUpperCase() } });
}

export async function createCoupon(data: {
  code: string;
  type: 'PERCENT' | 'FLAT';
  value: number;
  minOrderValue?: number;
  maxDiscount?: number | null;
  expiresAt?: Date | null;
  usageLimit?: number | null;
}) {
  return prisma.coupon.create({
    data: { ...data, code: data.code.trim().toUpperCase() },
  });
}

export async function updateCoupon(id: string, data: Partial<{
  isActive: boolean;
  value: number;
  minOrderValue: number;
  maxDiscount: number | null;
  expiresAt: Date | null;
  usageLimit: number | null;
}>) {
  return prisma.coupon.update({ where: { id }, data });
}

export async function deleteCoupon(id: string) {
  return prisma.coupon.delete({ where: { id } });
}

interface ValidationResult {
  valid: boolean;
  message?: string;
  discount?: number;
  coupon?: { id: string; code: string; type: string; value: number };
}

// Server-side validation — always re-run this at order-creation time too, never trust the client's discount number
export async function validateCoupon(code: string, subtotal: number): Promise<ValidationResult> {
  const coupon = await getCouponByCode(code);

  if (!coupon) return { valid: false, message: 'Invalid coupon code.' };
  if (!coupon.isActive) return { valid: false, message: 'This coupon is no longer active.' };
  if (coupon.expiresAt && coupon.expiresAt < new Date()) return { valid: false, message: 'This coupon has expired.' };
  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, message: 'This coupon has reached its usage limit.' };
  }
  if (subtotal < coupon.minOrderValue) {
    return { valid: false, message: `Minimum order value of ₹${coupon.minOrderValue} required for this coupon.` };
  }

  let discount = coupon.type === 'PERCENT' ? Math.round((subtotal * coupon.value) / 100) : coupon.value;
  if (coupon.maxDiscount !== null && coupon.maxDiscount !== undefined) {
    discount = Math.min(discount, coupon.maxDiscount);
  }
  discount = Math.min(discount, subtotal); // never discount more than the order is worth

  return {
    valid: true,
    discount,
    coupon: { id: coupon.id, code: coupon.code, type: coupon.type, value: coupon.value },
  };
}

// Called once an order is actually placed, to consume a use of the coupon
export async function redeemCoupon(code: string) {
  return prisma.coupon.update({
    where: { code: code.trim().toUpperCase() },
    data: { usedCount: { increment: 1 } },
  });
}
