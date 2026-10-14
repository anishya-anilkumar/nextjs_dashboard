import postgres from 'postgres';

export function connect() {
  const url = process.env.POSTGRES_URL;
  if (!url) {
    console.error('POSTGRES_URL is not set. Copy .env.example to .env and fill it in.');
    process.exit(1);
  }
  return postgres(url, { max: 1, onnotice: () => {} });
}
