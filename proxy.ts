import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

// Next.js 16 renamed `middleware.ts` to `proxy.ts`. This is the first line of
// defence; every data function and server action re-checks the session too.
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|.*\\.svg$|favicon.ico).*)'],
};
