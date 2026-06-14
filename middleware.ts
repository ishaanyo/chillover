import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
import { NextResponse } from 'next/server';

// Initialize NextAuth with ONLY the edge-safe config
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  const isTryingToAccessAdmin = req.nextUrl.pathname.startsWith('/admin');

  // If they are trying to access /admin but aren't logged in, send to login
  if (isTryingToAccessAdmin && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  // If they are logged in but NOT an admin, kick them to the homepage
  if (isTryingToAccessAdmin && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};