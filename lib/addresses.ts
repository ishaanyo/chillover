import { prisma } from './prisma';

interface AddressInput {
  label: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export async function getAddressesByUserId(userId: string) {
  return prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  });
}

export async function getAddressById(id: string) {
  return prisma.address.findUnique({ where: { id } });
}

export async function createAddress(userId: string, data: AddressInput) {
  if (data.isDefault) {
    await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
  }
  return prisma.address.create({ data: { ...data, userId } });
}

export async function updateAddress(id: string, userId: string, data: Partial<AddressInput>) {
  if (data.isDefault) {
    await prisma.address.updateMany({ where: { userId, NOT: { id } }, data: { isDefault: false } });
  }
  return prisma.address.update({ where: { id }, data });
}

export async function deleteAddress(id: string) {
  return prisma.address.delete({ where: { id } });
}
