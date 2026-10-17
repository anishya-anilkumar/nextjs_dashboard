'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import { signIn, signOut } from '@/auth';
import { sql } from './db';
import { requireUser } from './session';
import { IdSchema, InvoiceSchema, LoginSchema } from './validation';

export type InvoiceFormState = {
  errors?: { customerId?: string[]; amount?: string[]; status?: string[]; date?: string[] };
  message?: string | null;
  values?: { customerId: string; amount: string; status: string; date: string };
};

function readInvoiceForm(formData: FormData) {
  const values = {
    customerId: String(formData.get('customerId') ?? ''),
    amount: String(formData.get('amount') ?? ''),
    status: String(formData.get('status') ?? ''),
    date: String(formData.get('date') ?? ''),
  };
  return { values, parsed: InvoiceSchema.safeParse(values) };
}

const fieldErrors = (error: z.ZodError) => z.flattenError(error).fieldErrors;

export async function createInvoice(_prev: InvoiceFormState, formData: FormData): Promise<InvoiceFormState> {
  await requireUser();
  const { values, parsed } = readInvoiceForm(formData);
  if (!parsed.success) {
    return { errors: fieldErrors(parsed.error), message: 'Fix the highlighted fields and try again.', values };
  }
  const { customerId, amount, status, date } = parsed.data;
  try {
    await sql`INSERT INTO invoices (customer_id, amount, status, date)
              VALUES (${customerId}, ${amount}, ${status}, ${date})`;
  } catch (e) {
    console.error('createInvoice failed', e);
    const fk = (e as { code?: string }).code === '23503';
    return {
      message: fk ? 'That customer no longer exists.' : 'Database error: the invoice was not created.',
      values,
    };
  }
  revalidatePath('/dashboard', 'layout');
  redirect('/dashboard/invoices');
}

// The invoice id arrives as a hidden form field (not `.bind()`), which keeps the
// form working with progressive enhancement. It is validated like any other input.
export async function updateInvoice(_prev: InvoiceFormState, formData: FormData): Promise<InvoiceFormState> {
  await requireUser();
  const id = String(formData.get('id') ?? '');
  if (!IdSchema.safeParse(id).success) return { message: 'Invalid invoice id.' };
  const { values, parsed } = readInvoiceForm(formData);
  if (!parsed.success) {
    return { errors: fieldErrors(parsed.error), message: 'Fix the highlighted fields and try again.', values };
  }
  const { customerId, amount, status, date } = parsed.data;
  try {
    const result = await sql`UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amount}, status = ${status}, date = ${date}
      WHERE id = ${id}`;
    if (result.count === 0) return { message: 'This invoice no longer exists.', values };
  } catch (e) {
    console.error('updateInvoice failed', e);
    return { message: 'Database error: the invoice was not updated.', values };
  }
  revalidatePath('/dashboard', 'layout');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  await requireUser();
  if (!IdSchema.safeParse(id).success) throw new Error('Invalid invoice id.');
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
  } catch (e) {
    console.error('deleteInvoice failed', e);
    throw new Error('Database error: the invoice was not deleted.');
  }
  revalidatePath('/dashboard', 'layout');
}

export async function authenticate(_prev: string | undefined, formData: FormData) {
  const parsed = LoginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return z.flattenError(parsed.error).fieldErrors.email?.[0] ?? 'Enter your email and password.';
  try {
    await signIn('credentials', { ...parsed.data, redirectTo: '/dashboard' });
  } catch (error) {
    if (error instanceof AuthError) {
      return error.type === 'CredentialsSignin'
        ? 'Incorrect email or password.'
        : 'Something went wrong. Try again.';
    }
    throw error; // lets the successful-login redirect through
  }
}

export async function logout() {
  await signOut({ redirectTo: '/' });
}
