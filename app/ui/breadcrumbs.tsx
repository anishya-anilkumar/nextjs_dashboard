import Link from 'next/link';
import clsx from 'clsx';

export default function Breadcrumbs({ items }: { items: { label: string; href: string; active?: boolean }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 block">
      <ol className="flex font-display text-xl md:text-2xl">
        {items.map((b, i) => (
          <li key={b.href} aria-current={b.active} className={clsx(b.active ? 'text-gray-900' : 'text-gray-500')}>
            <Link href={b.href}>{b.label}</Link>
            {i < items.length - 1 && <span className="mx-3 inline-block">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
