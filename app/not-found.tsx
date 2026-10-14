import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 text-center">
      <h1 className="font-display text-2xl">Page not found</h1>
      <Link href="/" className="rounded-md bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-400">Go home</Link>
    </main>
  );
}
