import 'server-only';
import postgres from 'postgres';

declare global {
  var __sql: ReturnType<typeof postgres> | undefined;
}

function create() {
  const url = process.env.POSTGRES_URL;
  if (!url) throw new Error('POSTGRES_URL is not set. See .env.example.');
  return postgres(url, { max: 5, idle_timeout: 20 });
}

// Reuse one pool across hot reloads in development.
export const sql = globalThis.__sql ?? (globalThis.__sql = create());
