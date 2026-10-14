import { logout } from '@/app/lib/actions';
import { requireUser } from '@/app/lib/session';
import SideNav from '@/app/ui/dashboard/sidenav';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none border-b border-gray-100 md:w-64 md:border-b-0">
        <SideNav userName={user.name ?? user.email ?? 'user'} signOutAction={logout} />
      </div>
      <main className="grow p-4 md:overflow-y-auto md:p-10">{children}</main>
    </div>
  );
}
