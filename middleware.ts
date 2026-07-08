import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
import { NextResponse } from 'next/server';

// Initialize NextAuth with ONLY the edge-safe config
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  const path = req.nextUrl.pathname;
  const isTryingToAccessAdmin = path.startsWith('/admin');
  const isTryingToAccessAccount = path.startsWith('/myaccount');

  // If they are trying to access /admin but aren't logged in, send to login
  if (isTryingToAccessAdmin && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  // If they are logged in but NOT an admin, kick them to the homepage
  if (isTryingToAccessAdmin && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  // Customer account area requires login
  if (isTryingToAccessAccount && !isLoggedIn) {
    const loginUrl = new URL('/login', req.nextUrl);
    loginUrl.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};