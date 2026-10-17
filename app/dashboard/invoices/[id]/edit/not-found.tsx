import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2 py-16 text-center">
      <FaceFrownIcon className="w-10 text-gray-400" aria-hidden />
      <h2 className="font-display text-xl">Invoice not found</h2>
      <p className="text-sm text-gray-500">It may have been deleted, or the link is wrong.</p>
      <Link href="/dashboard/invoices" className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-400">
        Back to invoices
      </Link>
    </main>
  );
}
