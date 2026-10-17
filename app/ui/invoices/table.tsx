import { fetchFilteredInvoices } from '@/app/lib/data';
import { formatCurrency, formatDate } from '@/app/lib/utils';
import Avatar from '@/app/ui/avatar';
import { DeleteInvoice, UpdateInvoice } from './buttons';
import InvoiceStatusBadge from './status';

export default async function InvoicesTable({
  query,
  status,
  currentPage,
}: {
  query: string;
  status?: string;
  currentPage: number;
}) {
  const invoices = await fetchFilteredInvoices({ query, status }, currentPage);

  if (invoices.length === 0) {
    return (
      <div className="mt-6 rounded-lg bg-gray-50 px-6 py-16 text-center">
        <p className="font-medium text-gray-800">{query || status ? 'No invoices match your filters.' : 'No invoices yet.'}</p>
        <p className="mt-1 text-sm text-gray-500">
          {query || status ? 'Try a different search term or status.' : 'Create an invoice to start tracking payments.'}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Mobile: cards */}
          <div className="md:hidden">
            {invoices.map((inv) => (
              <div key={inv.id} className="mb-2 w-full rounded-md bg-white p-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Avatar name={inv.name} />
                      <p>{inv.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{inv.email}</p>
                  </div>
                  <InvoiceStatusBadge status={inv.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">{formatCurrency(inv.amount)}</p>
                    <p className="text-sm text-gray-500">{formatDate(inv.date)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateInvoice id={inv.id} />
                    <DeleteInvoice id={inv.id} customer={inv.name} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Desktop: table */}
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">Customer</th>
                <th scope="col" className="px-3 py-5 font-medium">Email</th>
                <th scope="col" className="px-3 py-5 font-medium">Amount</th>
                <th scope="col" className="px-3 py-5 font-medium">Date</th>
                <th scope="col" className="px-3 py-5 font-medium">Status</th>
                <th scope="col" className="relative py-3 pl-6 pr-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {invoices.map((inv) => (
                <tr key={inv.id} className="w-full border-b py-3 text-sm last-of-type:border-none">
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3"><Avatar name={inv.name} /><p>{inv.name}</p></div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">{inv.email}</td>
                  <td className="whitespace-nowrap px-3 py-3">{formatCurrency(inv.amount)}</td>
                  <td className="whitespace-nowrap px-3 py-3">{formatDate(inv.date)}</td>
                  <td className="whitespace-nowrap px-3 py-3"><InvoiceStatusBadge status={inv.status} /></td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateInvoice id={inv.id} />
                      <DeleteInvoice id={inv.id} customer={inv.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
