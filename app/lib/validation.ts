import { z } from 'zod';
import { dollarsToCents } from './utils';

export const InvoiceSchema = z.object({
  customerId: z.uuid({ error: 'Please select a customer.' }),
  amount: z
    .string()
    .trim()
    .regex(/^\d{1,7}(\.\d{1,2})?$/, { error: 'Enter an amount like 250 or 250.50.' })
    .transform(dollarsToCents)
    .refine((c) => c > 0, { error: 'Amount must be greater than $0.' }),
  status: z.enum(['pending', 'paid'], { error: 'Please select an invoice status.' }),
  date: z.iso.date({ error: 'Enter a valid date.' }),
});

export const LoginSchema = z.object({
  email: z.email({ error: 'Enter a valid email address.' }).max(255),
  password: z.string().min(1, { error: 'Enter your password.' }).max(200),
});

export const IdSchema = z.uuid();
