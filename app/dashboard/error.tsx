'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <main className="flex flex-col items-center justify-center gap-3 py-24 text-center" role="alert">
      <h2 className="font-display text-xl">Something went wrong</h2>
      <p className="max-w-md text-sm text-gray-600">
        We couldn&apos;t load or save this data. Check that the database is reachable, then try again.
      </p>
      <button onClick={reset} className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400">
        Try again
      </button>
    </main>
  );
}
