'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

// 1. Handle Login
export async function loginAction(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const callbackUrl = formData.get('callbackUrl') as string | null;

    // Check the user's role in the database to determine where they should go
    const user = await prisma.user.findUnique({ where: { email } });
    const defaultRedirect = user?.role === 'ADMIN' ? '/admin' : '/myaccount';
    const redirectUrl = callbackUrl && callbackUrl.trim() ? callbackUrl : defaultRedirect;

    // Tell NextAuth where to send the user after a successful login
    formData.append('redirectTo', redirectUrl);

    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid email or password.' };
        default:
          return { error: 'Something went wrong.' };
      }
    }
    throw error; 
  }
}

// 2. Handle Registration
export async function registerAction(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !email || !password) return { error: 'All fields are required' };

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) return { error: 'Email is already registered' };

  // Hash the password securely
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save to Neon DB
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  redirect('/login');
}

// 3. Handle Logout
export async function logoutAction() {
  await signOut({ redirectTo: '/login' });
}