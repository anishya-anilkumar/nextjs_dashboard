import { BanknotesIcon, ClockIcon, InboxIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { fetchCardData } from '@/app/lib/data';
import { formatCurrency } from '@/app/lib/utils';

function Card({ title, value, Icon }: { title: string; value: string | number; Icon: typeof BanknotesIcon }) {
  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        <Icon className="h-5 w-5 text-gray-700" aria-hidden />
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p className="truncate rounded-xl bg-white px-4 py-8 text-center font-display text-2xl">{value}</p>
    </div>
  );
}

export default async function CardWrapper() {
  const d = await fetchCardData();
  return (
    <>
      <Card title="Collected" value={formatCurrency(d.collected)} Icon={BanknotesIcon} />
      <Card title="Pending" value={formatCurrency(d.pending)} Icon={ClockIcon} />
      <Card title="Total invoices" value={d.invoiceCount} Icon={InboxIcon} />
      <Card title="Total customers" value={d.customerCount} Icon={UserGroupIcon} />
    </>
  );
}
