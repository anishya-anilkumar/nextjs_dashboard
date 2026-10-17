'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Bars3Icon, PowerIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Logo from '@/app/ui/logo';
import NavLinks from './nav-links';

/**
 * Desktop: fixed-width sidebar. Mobile: a top bar with a menu toggle.
 * `signOutAction` is a server action passed from the (server) layout.
 */
export default function SideNav({
  userName,
  signOutAction,
}: {
  userName: string;
  signOutAction: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);

  const signOut = (
    <form action={signOutAction}>
      <button className="flex h-12 w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-blue-500 md:flex-none md:justify-start md:p-2 md:px-3">
        <PowerIcon className="w-6" />
        <span>Sign out</span>
      </button>
    </form>
  );

  return (
    <nav aria-label="Main" className="flex flex-col px-3 py-4 md:h-full md:px-2">
      <div className="flex items-center justify-between md:block">
        <Link className="block rounded-md bg-blue-600 p-3 md:mb-2 md:h-40 md:p-4 md:flex md:items-end" href="/dashboard">
          <Logo className="w-32 md:w-40" />
        </Link>
        <button
          type="button"
          className="rounded-md p-2 text-gray-700 hover:bg-gray-100 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      <div id="mobile-menu" className={`${open ? 'flex' : 'hidden'} mt-2 flex-col gap-2 md:flex md:grow md:justify-between`}>
        <div className="flex flex-col gap-2">
          <NavLinks onNavigate={() => setOpen(false)} />
        </div>
        <div className="mt-2 flex flex-col gap-2 md:mt-0">
          <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block" />
          <p className="truncate px-3 text-xs text-gray-500" title={userName}>Signed in as {userName}</p>
          {signOut}
        </div>
      </div>
    </nav>
  );
}
