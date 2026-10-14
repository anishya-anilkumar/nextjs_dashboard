import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { template: '%s | Acme Dashboard', default: 'Acme Dashboard' },
  description: 'Track invoices, customers and revenue in one place.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
