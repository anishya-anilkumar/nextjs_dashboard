import type { Metadata } from 'next';
import { Suspense } from 'react';
import { fetchFilteredCustomers } from '@/app/lib/data';
import { formatCurrency } from '@/app/lib/utils';
import Avatar from '@/app/ui/avatar';
import Search from '@/app/ui/search';
import { TableSkeleton } from '@/app/ui/skeletons';

export const metadata: Metadata = { title: 'Customers' };

async function CustomersTable({ query }: { query: string }) {
  const customers = await fetchFilteredCustomers(query);
  if (customers.length === 0) {
    return (
      <div className="mt-6 rounded-lg bg-gray-50 px-6 py-16 text-center">
        <p className="font-medium text-gray-800">{query ? 'No customers match your search.' : 'No customers yet.'}</p>
        {query && <p className="mt-1 text-sm text-gray-500">Try a different name or email.</p>}
      </div>
    );
  }
  return (
    <div className="mt-6 overflow-x-auto rounded-lg bg-gray-50 p-2">
      <table className="min-w-full text-left text-sm text-gray-900">
        <thead>
          <tr>
            <th scope="col" className="px-4 py-4 font-medium sm:pl-6">Customer</th>
            <th scope="col" className="px-3 py-4 font-medium">Email</th>
            <th scope="col" className="px-3 py-4 text-right font-medium">Invoices</th>
            <th scope="col" className="px-3 py-4 text-right font-medium">Total invoiced</th>
            <th scope="col" className="px-3 py-4 pr-6 text-right font-medium">Outstanding</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {customers.map((c) => (
            <tr key={c.id} className="border-b last-of-type:border-none">
              <td className="whitespace-nowrap py-3 pl-6 pr-3">
                <div className="flex items-center gap-3"><Avatar name={c.name} /><p>{c.name}</p></div>
              </td>
              <td className="whitespace-nowrap px-3 py-3">{c.email}</td>
              <td className="whitespace-nowrap px-3 py-3 text-right">{c.total_invoices}</td>
              <td className="whitespace-nowrap px-3 py-3 text-right">{formatCurrency(c.total_invoiced)}</td>
              <td className={`whitespace-nowrap px-3 py-3 pr-6 text-right ${c.outstanding > 0 ? 'font-medium text-amber-700' : 'text-gray-500'}`}>
                {formatCurrency(c.outstanding)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function Page(props: { searchParams?: Promise<{ query?: string }> }) {
  const query = (await props.searchParams)?.query ?? '';
  return (
    <div className="w-full">
      <h1 className="font-display text-2xl">Customers</h1>
      <div className="mt-4 md:mt-8"><Search placeholder="Search customers" /></div>
      <Suspense key={query} fallback={<TableSkeleton />}>
        <CustomersTable query={query} />
      </Suspense>
    </div>
  );
}
