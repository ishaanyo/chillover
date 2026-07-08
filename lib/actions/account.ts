'use server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateProfileAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: 'You must be logged in.' };

  const name = (formData.get('name') as string)?.trim();
  const phone = (formData.get('phone') as string)?.trim();
  const dob = formData.get('dob') as string;
  const gender = formData.get('gender') as string;

  if (!name) return { error: 'Name is required.' };

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        phone: phone || null,
        dob: dob ? new Date(dob) : null,
        gender: gender || null,
      },
    });

    revalidatePath('/myaccount/profile');
    revalidatePath('/myaccount');
    return { success: true };
  } catch (err) {
    console.error('Update profile error:', err);
    return { error: 'Failed to update profile.' };
  }
}
