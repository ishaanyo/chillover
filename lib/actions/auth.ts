'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// 1. Handle Login
export async function loginAction(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const callbackUrl = formData.get('callbackUrl') as string | null;

    // Check the user's role in the database to determine where they should go
    const user = await prisma.user.findUnique({ where: { email } });
    const defaultRedirect = user?.role === 'ADMIN' ? '/admin' : '/myaccount';
    const redirectUrl = callbackUrl && callbackUrl.trim() ? callbackUrl : defaultRedirect;

    // Pass an explicit options object (not the raw FormData) so there's no ambiguity
    // about which field Auth.js treats as the redirect target.
    await signIn('credentials', {
      email,
      password,
      redirectTo: redirectUrl,
    });
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

  // Immediately log the new user in and take them straight to their account
  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/myaccount',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      // Account was created successfully even if auto-login somehow fails —
      // fall back to sending them to the login page instead of erroring out.
      return { error: 'Account created! Please log in.', redirectToLogin: true };
    }
    throw error;
  }
}

// 3. Handle Logout
export async function logoutAction() {
  await signOut({ redirectTo: '/login' });
}
