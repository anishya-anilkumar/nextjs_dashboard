'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { DocumentDuplicateIcon, HomeIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Invoices', href: '/dashboard/invoices', icon: DocumentDuplicateIcon },
  { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon },
];

export default function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <>
      {links.map(({ name, href, icon: Icon }) => {
        const active = href === '/dashboard' ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={name}
            href={href}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            className={clsx(
              'flex h-12 grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-blue-500 md:flex-none md:justify-start md:p-2 md:px-3',
              { 'bg-sky-100 text-blue-600': active },
            )}
          >
            <Icon className="w-6" />
            <span>{name}</span>
          </Link>
        );
      })}
    </>
  );
}
