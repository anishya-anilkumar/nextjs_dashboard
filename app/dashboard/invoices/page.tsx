import type { Metadata } from 'next';
import { Suspense } from 'react';
import { fetchInvoicesPages } from '@/app/lib/data';
import Search from '@/app/ui/search';
import StatusFilter from '@/app/ui/invoices/status-filter';
import Pagination from '@/app/ui/invoices/pagination';
import InvoicesTable from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { TableSkeleton } from '@/app/ui/skeletons';

export const metadata: Metadata = { title: 'Invoices' };

export default async function Page(props: {
  searchParams?: Promise<{ query?: string; page?: string; status?: string }>;
}) {
  const sp = (await props.searchParams) ?? {};
  const query = sp.query ?? '';
  const status = sp.status;
  const totalPages = await fetchInvoicesPages({ query, status });
  // Clamp: ?page=999 or ?page=abc shows a valid page instead of an empty table.
  const currentPage = Math.min(Math.max(Math.floor(Number(sp.page)) || 1, 1), totalPages);

  return (
    <div className="w-full">
      <h1 className="font-display text-2xl">Invoices</h1>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search by customer, email, amount or date" />
        <StatusFilter />
        <CreateInvoice />
      </div>
      <Suspense key={`${query}|${status}|${currentPage}`} fallback={<TableSkeleton />}>
        <InvoicesTable query={query} status={status} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
