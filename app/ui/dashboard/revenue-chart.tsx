import { CalendarIcon } from '@heroicons/react/24/outline';
import { fetchMonthlyRevenue } from '@/app/lib/data';
import { formatCurrency, generateYAxis } from '@/app/lib/utils';

export default async function RevenueChart() {
  const revenue = await fetchMonthlyRevenue();
  const { yAxisLabels, topLabel } = generateYAxis(revenue);
  const hasData = revenue.some((m) => m.revenue > 0);
  const chartHeight = 350;

  return (
    <div className="w-full md:col-span-4">
      <h2 className="mb-4 font-display text-xl md:text-2xl">Monthly revenue</h2>
      <div className="rounded-xl bg-gray-50 p-4">
        {!hasData ? (
          <p className="py-24 text-center text-sm text-gray-500">
            No paid invoices in the last 12 months. Paid revenue will appear here.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-12 items-end gap-2 rounded-md bg-white p-4 sm:grid-cols-13 md:gap-4">
              <div className="mb-6 hidden flex-col justify-between text-sm text-gray-500 sm:flex" style={{ height: chartHeight }}>
                {yAxisLabels.map((l) => <p key={l}>{l}</p>)}
              </div>
              {revenue.map((m) => (
                <div key={m.month} className="flex flex-col items-center gap-2" title={`${m.month}: ${formatCurrency(m.revenue)}`}>
                  <div
                    className="w-full rounded-md bg-blue-300"
                    style={{ height: `${(chartHeight / (topLabel * 100)) * m.revenue}px` }}
                    role="img"
                    aria-label={`${m.month}: ${formatCurrency(m.revenue)}`}
                  />
                  <p className="-rotate-90 text-sm text-gray-400 sm:rotate-0">{m.month}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center pb-2 pt-6">
              <CalendarIcon className="h-5 w-5 text-gray-500" aria-hidden />
              <h3 className="ml-2 text-sm text-gray-500">Paid invoices, last 12 months</h3>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
