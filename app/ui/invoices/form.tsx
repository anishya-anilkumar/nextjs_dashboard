'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { CheckIcon, ClockIcon, CurrencyDollarIcon, ExclamationCircleIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import type { CustomerField, InvoiceForm } from '@/app/lib/definitions';
import { createInvoice, updateInvoice, type InvoiceFormState } from '@/app/lib/actions';
import { centsToDollars } from '@/app/lib/utils';
import { Button } from '@/app/ui/button';

function FieldError({ id, messages }: { id: string; messages?: string[] }) {
  return (
    <div id={id} aria-live="polite" aria-atomic="true">
      {messages?.map((m) => (
        <p className="mt-2 text-sm text-red-500" key={m}>{m}</p>
      ))}
    </div>
  );
}

/** One form for both create (no `invoice`) and edit. */
export default function InvoiceFormView({ customers, invoice }: { customers: CustomerField[]; invoice?: InvoiceForm }) {
  const action = invoice ? updateInvoice : createInvoice;
  const [state, formAction, pending] = useActionState<InvoiceFormState, FormData>(action, {});

  // After a failed submit, keep what the person typed; otherwise use the saved invoice.
  const v = state.values;
  const customerId = v?.customerId ?? invoice?.customer_id ?? '';
  const amount = v?.amount ?? (invoice ? centsToDollars(invoice.amount) : '');
  const status = v?.status ?? invoice?.status ?? '';
  const date = v?.date ?? invoice?.date ?? new Date().toISOString().slice(0, 10);
  const e = state.errors ?? {};
  const inputCls = 'peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500';

  return (
    <form action={formAction} noValidate>
      {invoice && <input type="hidden" name="id" value={invoice.id} />}
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">Customer</label>
          <div className="relative">
            <select id="customer" name="customerId" defaultValue={customerId} key={`c-${customerId}`}
              aria-describedby="customer-error" aria-invalid={!!e.customerId}
              className={`${inputCls} bg-white`}>
              <option value="" disabled>Select a customer</option>
              {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <FieldError id="customer-error" messages={e.customerId} />
        </div>

        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">Amount (USD)</label>
          <div className="relative">
            <input id="amount" name="amount" type="text" inputMode="decimal" defaultValue={amount} key={`a-${amount}`}
              placeholder="0.00" aria-describedby="amount-error" aria-invalid={!!e.amount} className={inputCls} />
            <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <FieldError id="amount-error" messages={e.amount} />
        </div>

        <div className="mb-4">
          <label htmlFor="date" className="mb-2 block text-sm font-medium">Invoice date</label>
          <input id="date" name="date" type="date" defaultValue={date} key={`d-${date}`}
            aria-describedby="date-error" aria-invalid={!!e.date}
            className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-2" />
          <FieldError id="date-error" messages={e.date} />
        </div>

        <fieldset aria-describedby="status-error">
          <legend className="mb-2 block text-sm font-medium">Invoice status</legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <label className="flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 has-[:checked]:ring-2 has-[:checked]:ring-blue-500">
                <input name="status" type="radio" value="pending" defaultChecked={status === 'pending'} key={`p-${status}`} className="h-4 w-4" />
                Pending <ClockIcon className="h-4 w-4" aria-hidden />
              </label>
              <label className="flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white has-[:checked]:ring-2 has-[:checked]:ring-blue-500">
                <input name="status" type="radio" value="paid" defaultChecked={status === 'paid'} key={`s-${status}`} className="h-4 w-4" />
                Paid <CheckIcon className="h-4 w-4" aria-hidden />
              </label>
            </div>
          </div>
          <FieldError id="status-error" messages={e.status} />
        </fieldset>

        <div aria-live="polite" aria-atomic="true">
          {state.message && (
            <p className="mt-4 flex items-center gap-1 text-sm text-red-500">
              <ExclamationCircleIcon className="h-5 w-5" aria-hidden /> {state.message}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link href="/dashboard/invoices" className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 hover:bg-gray-200">
          Cancel
        </Link>
        <Button type="submit" disabled={pending} aria-disabled={pending}>
          {pending ? 'Saving…' : invoice ? 'Save changes' : 'Create invoice'}
        </Button>
      </div>
    </form>
  );
}
