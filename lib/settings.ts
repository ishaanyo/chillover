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

interface DelhiveryConfigInput {
  delhiveryEnabled: boolean;
  delhiveryApiKey?: string | null;
  delhiveryClientName?: string | null;
  delhiveryPickupName?: string | null;
  delhiveryPickupAddress?: string | null;
  delhiveryPickupCity?: string | null;
  delhiveryPickupPincode?: string | null;
  delhiveryPickupPhone?: string | null;
}

export async function updateDelhiveryConfig(data: DelhiveryConfigInput) {
  return prisma.storeSettings.upsert({
    where: { id: 'main' },
    update: data,
    create: { id: 'main', codEnabled: true, ...data },
  });
}
