'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { deleteInvoice } from '@/app/lib/actions';

export function CreateInvoice() {
  return (
    <Link
      href="/dashboard/invoices/create"
      className="flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
    >
      <span className="hidden md:block">Create invoice</span>
      <PlusIcon className="h-5 md:ml-4" aria-hidden />
      <span className="sr-only md:hidden">Create invoice</span>
    </Link>
  );
}

export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Link href={`/dashboard/invoices/${id}/edit`} className="rounded-md border p-2 hover:bg-gray-100">
      <span className="sr-only">Edit invoice</span>
      <PencilIcon className="w-5" />
    </Link>
  );
}

/** Opens a confirmation dialog; the delete only runs when confirmed. */
export function DeleteInvoice({ id, customer }: { id: string; customer: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const deleteWithId = deleteInvoice.bind(null, id);
  return (
    <>
      <button type="button" className="rounded-md border p-2 hover:bg-gray-100" onClick={() => dialog.current?.showModal()}>
        <span className="sr-only">Delete invoice for {customer}</span>
        <TrashIcon className="w-5" />
      </button>
      <dialog
        ref={dialog}
        aria-labelledby={`del-${id}`}
        className="m-auto w-[min(92vw,26rem)] rounded-xl p-6 shadow-xl backdrop:bg-black/40"
      >
        <h2 id={`del-${id}`} className="font-display text-lg">Delete this invoice?</h2>
        <p className="mt-2 text-sm text-gray-600">
          The invoice for {customer} will be permanently deleted. This can&apos;t be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" autoFocus className="h-10 rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 hover:bg-gray-200" onClick={() => dialog.current?.close()}>
            Cancel
          </button>
          <form action={deleteWithId} onSubmit={() => dialog.current?.close()}>
            <button className="h-10 rounded-lg bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-500">Delete invoice</button>
          </form>
        </div>
      </dialog>
    </>
  );
}
