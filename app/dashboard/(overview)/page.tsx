import type { Metadata } from 'next';
import { Suspense } from 'react';
import CardWrapper from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { CardsSkeleton, LatestInvoicesSkeleton, RevenueChartSkeleton } from '@/app/ui/skeletons';

export const metadata: Metadata = { title: 'Overview' };

export default function Page() {
  return (
    <div>
      <h1 className="mb-4 font-display text-xl md:text-2xl">Overview</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}><CardWrapper /></Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}><RevenueChart /></Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}><LatestInvoices /></Suspense>
      </div>
    </div>
  );
}
