import clsx from 'clsx';
import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import type { InvoiceStatus } from '@/app/lib/definitions';

export default function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <span
      className={clsx('inline-flex items-center rounded-full px-2 py-1 text-xs', {
        'bg-gray-100 text-gray-600': status === 'pending',
        'bg-green-500 text-white': status === 'paid',
      })}
    >
      {status === 'pending' ? (
        <>Pending <ClockIcon className="ml-1 w-4" aria-hidden /></>
      ) : (
        <>Paid <CheckIcon className="ml-1 w-4" aria-hidden /></>
      )}
    </span>
  );
}
