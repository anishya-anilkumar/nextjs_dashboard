import Link from 'next/link';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { fetchLatestInvoices } from '@/app/lib/data';
import { formatCurrency, formatDate } from '@/app/lib/utils';
import Avatar from '@/app/ui/avatar';
import InvoiceStatusBadge from '@/app/ui/invoices/status';

export default async function LatestInvoices() {
  const invoices = await fetchLatestInvoices();
  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className="mb-4 font-display text-xl md:text-2xl">Recent invoices</h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        {invoices.length === 0 ? (
          <div className="rounded-md bg-white px-6 py-12 text-center text-sm text-gray-500">
            No invoices yet.{' '}
            <Link href="/dashboard/invoices/create" className="font-medium text-blue-600 underline">Create your first invoice</Link>.
          </div>
        ) : (
          <ul className="rounded-md bg-white px-6">
            {invoices.map((inv, i) => (
              <li key={inv.id} className={`flex items-center justify-between gap-3 py-4 ${i !== 0 ? 'border-t' : ''}`}>
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar name={inv.name} size={32} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold md:text-base">{inv.name}</p>
                    <p className="hidden truncate text-sm text-gray-500 sm:block">{inv.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="truncate text-sm font-medium md:text-base">{formatCurrency(inv.amount)}</p>
                  <p className="text-xs text-gray-500">{formatDate(inv.date)}</p>
                </div>
                <div className="hidden sm:block"><InvoiceStatusBadge status={inv.status} /></div>
              </li>
            ))}
          </ul>
        )}
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" aria-hidden />
          <h3 className="ml-2 text-sm text-gray-500">Updated when invoices change</h3>
        </div>
      </div>
    </div>
  );
}
