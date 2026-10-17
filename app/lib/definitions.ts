export type InvoiceStatus = 'pending' | 'paid';

export type User = { id: string; name: string; email: string; password_hash: string };

export type CustomerField = { id: string; name: string };

export type InvoicesTableRow = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string | null;
  amount: number; // cents
  date: string; // YYYY-MM-DD
  status: InvoiceStatus;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number; // cents
  status: InvoiceStatus;
  date: string;
};

export type CustomerRow = {
  id: string;
  name: string;
  email: string;
  image_url: string | null;
  total_invoices: number;
  total_invoiced: number; // cents
  outstanding: number; // cents
};

export type MonthlyRevenue = { month: string; revenue: number }; // revenue in cents

export type CardData = {
  collected: number;
  pending: number;
  invoiceCount: number;
  customerCount: number;
};
