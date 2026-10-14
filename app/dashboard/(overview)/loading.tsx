import { CardsSkeleton, LatestInvoicesSkeleton, RevenueChartSkeleton } from '@/app/ui/skeletons';

// Scoped to the overview route group so that other routes (e.g. invoice edit)
// can return a real HTTP 404 instead of streaming a 200 first.
export default function Loading() {
  return (
    <div aria-busy="true">
      <div className="mb-4 h-8 w-32 shimmer rounded-md bg-gray-100" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"><CardsSkeleton /></div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <RevenueChartSkeleton />
        <LatestInvoicesSkeleton />
      </div>
    </div>
  );
}
