import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { connect } from './db';

async function main() {
  const sql = connect();
  try {
    await sql.unsafe(readFileSync(join(process.cwd(), 'db', 'schema.sql'), 'utf8'));
    console.log('Schema applied.');
  } finally {
    await sql.end();
  }
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
