const box = 'shimmer rounded-md bg-gray-100';

export function CardSkeleton() {
  return (
    <div className="shimmer rounded-xl bg-gray-100 p-2 shadow-sm">
      <div className="flex p-4"><div className="h-5 w-5 rounded-md bg-gray-200" /><div className="ml-2 h-6 w-16 rounded-md bg-gray-200" /></div>
      <div className="flex items-center justify-center truncate rounded-xl bg-white px-4 py-8"><div className="h-7 w-20 rounded-md bg-gray-200" /></div>
    </div>
  );
}
export function CardsSkeleton() {
  return <>{[0, 1, 2, 3].map((i) => <CardSkeleton key={i} />)}</>;
}
export function RevenueChartSkeleton() {
  return (
    <div className="w-full md:col-span-4" aria-hidden>
      <div className={`mb-4 h-8 w-36 ${box}`} />
      <div className={`${box} h-[26rem] rounded-xl`} />
    </div>
  );
}
export function LatestInvoicesSkeleton() {
  return (
    <div className="flex w-full flex-col md:col-span-4 lg:col-span-4" aria-hidden>
      <div className={`mb-4 h-8 w-36 ${box}`} />
      <div className={`${box} h-[26rem] rounded-xl`} />
    </div>
  );
}
export function TableSkeleton() {
  return (
    <div className="mt-6 space-y-2" aria-hidden role="status" aria-label="Loading">
      {Array.from({ length: 8 }, (_, i) => <div key={i} className={`h-14 ${box}`} />)}
    </div>
  );
}
