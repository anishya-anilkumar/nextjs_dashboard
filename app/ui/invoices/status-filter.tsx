'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function StatusFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  return (
    <div>
      <label htmlFor="status-filter" className="sr-only">Filter by status</label>
      <select
        id="status-filter"
        className="block h-10 rounded-md border border-gray-200 bg-white px-3 text-sm outline-2"
        defaultValue={searchParams.get('status') ?? ''}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams);
          params.delete('page');
          if (e.target.value) params.set('status', e.target.value);
          else params.delete('status');
          replace(`${pathname}?${params.toString()}`);
        }}
      >
        <option value="">All statuses</option>
        <option value="pending">Pending</option>
        <option value="paid">Paid</option>
      </select>
    </div>
  );
}
