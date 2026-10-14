import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

/**
 * Server-side authorization gate. Call at the top of every data query and
 * server action — never rely on the proxy alone. Memoised per request so
 * several queries in one render share a single session lookup.
 */
export const requireUser = cache(async () => {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');
  return session.user;
});
