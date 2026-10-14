import type { NextAuthConfig } from 'next-auth';

/**
 * Edge-safe config (no database or bcrypt imports) shared by the proxy and auth.ts.
 */
export const authConfig = {
  pages: { signIn: '/login' },
  session: { strategy: 'jwt', maxAge: 60 * 60 * 8 }, // 8 hours
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const loggedIn = !!auth?.user;
      const onDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (onDashboard) return loggedIn; // false => redirect to /login
      if (loggedIn && nextUrl.pathname === '/login') {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
    jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id;
      return session;
    },
  },
} satisfies NextAuthConfig;
