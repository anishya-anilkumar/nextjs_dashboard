import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { authConfig } from './auth.config';
import { sql } from '@/app/lib/db';
import { LoginSchema } from '@/app/lib/validation';
import type { User } from '@/app/lib/definitions';

// Compared against when the email is unknown, so response time doesn't reveal
// whether an account exists.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12);

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = LoginSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        const [user] = await sql<User[]>`
          SELECT id, name, email, password_hash FROM users WHERE lower(email) = lower(${email})`;
        const ok = await bcrypt.compare(password, user?.password_hash ?? DUMMY_HASH);
        if (!user || !ok) return null;
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
});
