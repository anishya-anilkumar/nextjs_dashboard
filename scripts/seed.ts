/**
 * Seeds DEMO data only. Every row is flagged is_demo = TRUE so it can be told
 * apart from real data.
 * Re-running replaces previous demo rows; real rows are never touched.
 */
import bcrypt from 'bcryptjs';
import { connect } from './db';

const DEMO_EMAIL = 'demo@example.com';

const customers = [
  { name: 'Delba de Oliveira', email: 'delba@example.com' },
  { name: 'Lee Robinson', email: 'lee@example.com' },
  { name: 'Hector Simpson', email: 'hector@example.com' },
  { name: 'Steph Dietz', email: 'steph@example.com' },
  { name: 'Steven Tey', email: 'steven@example.com' },
  { name: 'Michael Novotny', email: 'michael@example.com' },
  { name: 'Evil Rabbit', email: 'evil@example.com' },
  { name: 'Emil Kowalski', email: 'emil@example.com' },
  { name: 'Amy Burns', email: 'amy@example.com' },
  { name: 'Balazs Orban', email: 'balazs@example.com' },
];

// Small deterministic PRNG so the demo data is the same on every run.
function prng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

async function main() {
  const password = process.env.SEED_DEMO_PASSWORD;
  if (!password || password.length < 8) {
    console.error('Set SEED_DEMO_PASSWORD (min 8 characters) in .env to create the demo user.');
    process.exit(1);
  }
  const sql = connect();
  try {
    await sql.begin(async (tx) => {
      // Invoices cascade from customers.
      await tx`DELETE FROM customers WHERE is_demo`;
      await tx`DELETE FROM users WHERE is_demo`;

      const hash = await bcrypt.hash(password, 12);
      await tx`
        INSERT INTO users (name, email, password_hash, is_demo)
        VALUES ('Demo User', ${DEMO_EMAIL}, ${hash}, TRUE)
        ON CONFLICT DO NOTHING`;

      const rows = await tx<{ id: string }[]>`
        INSERT INTO customers ${tx(customers.map((c) => ({ ...c, is_demo: true })))}
        ON CONFLICT (email) DO NOTHING
        RETURNING id`;

      const rand = prng(42);
      const today = new Date();
      const invoices: { customer_id: string; amount: number; status: string; date: string; is_demo: boolean }[] = [];
      // ~3 invoices per month for the last 12 months.
      for (let m = 11; m >= 0; m--) {
        for (let i = 0; i < 3; i++) {
          const d = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - m, 1 + Math.floor(rand() * 26)));
          if (d > today) d.setTime(today.getTime() - 86400000);
          const old = m >= 2;
          invoices.push({
            customer_id: rows[Math.floor(rand() * rows.length)].id,
            amount: (200 + Math.floor(rand() * 4800)) * 100 + Math.floor(rand() * 100),
            status: old || rand() > 0.35 ? 'paid' : 'pending',
            date: d.toISOString().slice(0, 10),
            is_demo: true,
          });
        }
      }
      if (rows.length) await tx`INSERT INTO invoices ${tx(invoices)}`;
      console.log(`Seeded ${rows.length} demo customers, ${invoices.length} demo invoices, user ${DEMO_EMAIL}.`);
    });
  } finally {
    await sql.end();
  }
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
