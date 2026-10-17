'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { usePathname, useSearchParams } from 'next/navigation';
import { generatePagination } from '@/app/lib/utils';

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Math.min(Math.max(Number(searchParams.get('page')) || 1, 1), totalPages);

  // Keeps query + status; only `page` changes.
  const href = (page: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    return `${pathname}?${params.toString()}`;
  };

  const arrow = (dir: 'left' | 'right', disabled: boolean, target: number) => {
    const cls = clsx('flex h-10 w-10 items-center justify-center rounded-md border', {
      'pointer-events-none text-gray-300': disabled,
      'hover:bg-gray-100': !disabled,
      'mr-2 md:mr-4': dir === 'left',
      'ml-2 md:ml-4': dir === 'right',
    });
    const icon = dir === 'left' ? <ArrowLeftIcon className="w-4" /> : <ArrowRightIcon className="w-4" />;
    const label = dir === 'left' ? 'Previous page' : 'Next page';
    return disabled ? (
      <div className={cls} aria-hidden>{icon}</div>
    ) : (
      <Link className={cls} href={href(target)} aria-label={label}>{icon}</Link>
    );
  };

  return (
    <nav aria-label="Pagination" className="inline-flex">
      {arrow('left', currentPage <= 1, currentPage - 1)}
      <div className="flex -space-x-px">
        {generatePagination(currentPage, totalPages).map((page, i) =>
          page === '...' ? (
            <div key={`gap-${i}`} className="flex h-10 w-10 items-center justify-center border text-sm text-gray-400">…</div>
          ) : (
            <Link
              key={page}
              href={href(page)}
              aria-current={page === currentPage ? 'page' : undefined}
              className={clsx('flex h-10 w-10 items-center justify-center border text-sm', {
                'z-10 border-blue-600 bg-blue-600 text-white': page === currentPage,
                'hover:bg-gray-100': page !== currentPage,
              })}
            >
              {page}
            </Link>
          ),
        )}
      </div>
      {arrow('right', currentPage >= totalPages, currentPage + 1)}
    </nav>
  );
}
