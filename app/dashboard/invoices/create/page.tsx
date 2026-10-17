import type { Metadata } from 'next';
import { fetchCustomerOptions } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import InvoiceFormView from '@/app/ui/invoices/form';

export const metadata: Metadata = { title: 'Create invoice' };

export default async function Page() {
  const customers = await fetchCustomerOptions();
  return (
    <main>
      <Breadcrumbs items={[
        { label: 'Invoices', href: '/dashboard/invoices' },
        { label: 'Create invoice', href: '/dashboard/invoices/create', active: true },
      ]} />
      {customers.length === 0 ? (
        <p className="rounded-md bg-gray-50 p-6 text-sm text-gray-600">
          There are no customers yet. Add a customer to the database before creating an invoice.
        </p>
      ) : (
        <InvoiceFormView customers={customers} />
      )}
    </main>
  );
}
