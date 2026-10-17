'use client';

import { useActionState } from 'react';
import { ArrowRightIcon, AtSymbolIcon, ExclamationCircleIcon, KeyIcon } from '@heroicons/react/24/outline';
import { authenticate } from '@/app/lib/actions';
import { Button } from './button';

export default function LoginForm() {
  const [error, formAction, pending] = useActionState(authenticate, undefined);

  return (
    <form action={formAction} className="space-y-3" noValidate>
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className="mb-3 font-display text-2xl">Log in to continue.</h1>
        <div className="w-full">
          <div>
            <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="email">Email</label>
            <div className="relative">
              <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com"
                aria-describedby="login-error"
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500" />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="password">Password</label>
            <div className="relative">
              <input id="password" name="password" type="password" required autoComplete="current-password" placeholder="Your password"
                aria-describedby="login-error"
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500" />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <Button className="mt-6 w-full" aria-disabled={pending} disabled={pending}>
          {pending ? 'Logging in…' : 'Log in'} <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        <div id="login-error" className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
          {error && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{error}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
