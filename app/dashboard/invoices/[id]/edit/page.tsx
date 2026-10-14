import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchCustomerOptions, fetchInvoiceById } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import InvoiceFormView from '@/app/ui/invoices/form';

export const metadata: Metadata = { title: 'Edit invoice' };

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const [invoice, customers] = await Promise.all([fetchInvoiceById(id), fetchCustomerOptions()]);
  if (!invoice) notFound();
  return (
    <main>
      <Breadcrumbs items={[
        { label: 'Invoices', href: '/dashboard/invoices' },
        { label: 'Edit invoice', href: `/dashboard/invoices/${id}/edit`, active: true },
      ]} />
      <InvoiceFormView invoice={invoice} customers={customers} />
    </main>
  );
}
