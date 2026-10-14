import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Logo from '@/app/ui/logo';

const bars = [38, 52, 44, 66, 58, 80, 72, 92, 70, 86, 98, 90];

function Preview() {
  return (
    <div
      role="img"
      aria-label="Preview of the dashboard: revenue cards, a monthly revenue chart and recent invoices"
      className="w-full max-w-xl rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-xl md:p-5"
    >
      <div className="grid grid-cols-3 gap-3">
        {[['Collected', '$61,250'], ['Pending', '$12,480'], ['Invoices', '36']].map(([k, v]) => (
          <div key={k} className="rounded-lg bg-white p-3 shadow-sm">
            <p className="text-[11px] text-gray-500">{k}</p>
            <p className="mt-1 font-display text-lg text-gray-900 md:text-xl">{v}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-lg bg-white p-3 shadow-sm">
        <p className="text-[11px] text-gray-500">Revenue, last 12 months</p>
        <div className="mt-3 flex h-28 items-end gap-1.5">
          {bars.map((h, i) => (
            <div key={i} style={{ height: `${h}%` }} className="flex-1 rounded-t bg-blue-300" />
          ))}
        </div>
      </div>
      <div className="mt-3 divide-y rounded-lg bg-white px-3 shadow-sm">
        {[['Delba de Oliveira', '$2,450.00', 'Paid'], ['Lee Robinson', '$890.00', 'Pending'], ['Amy Burns', '$1,320.50', 'Paid']].map(
          ([n, a, s]) => (
            <div key={n} className="flex items-center justify-between py-2 text-xs">
              <span className="text-gray-800">{n}</span>
              <span className="flex items-center gap-3">
                <span className="text-gray-600">{a}</span>
                <span className={`rounded-full px-2 py-0.5 ${s === 'Paid' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'}`}>{s}</span>
              </span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-4 md:p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-44">
        <Logo />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-16">
          <h1 className="font-display text-xl leading-normal text-gray-800 md:text-3xl">
            <strong>Welcome to Acme.</strong> Know what you&apos;re owed, who owes it, and what came in this month.
          </h1>
          <p className="text-gray-600">
            Create invoices, follow payments and see revenue by month, backed by your own PostgreSQL database.
          </p>
          <Link
            href="/login"
            className="flex items-center gap-4 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 md:text-base"
          >
            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="flex items-center justify-center p-2 md:w-3/5 md:px-8 md:py-12">
          <Preview />
        </div>
      </div>
    </main>
  );
}
