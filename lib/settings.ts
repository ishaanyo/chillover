import { prisma } from './prisma';

// Ensures the single settings row exists, then returns it
export async function getStoreSettings() {
  return prisma.storeSettings.upsert({
    where: { id: 'main' },
    update: {},
    create: { id: 'main', codEnabled: true },
  });
}

export async function updateCodEnabled(enabled: boolean) {
  return prisma.storeSettings.upsert({
    where: { id: 'main' },
    update: { codEnabled: enabled },
    create: { id: 'main', codEnabled: enabled },
  });
}
