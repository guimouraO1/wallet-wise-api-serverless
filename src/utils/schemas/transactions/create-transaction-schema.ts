import { z } from 'zod';

export const TransactionCreateSchema = z.object({
    name: z.string().max(100).min(3),
    description: z.string().max(255).nullish().optional(),
    amount: z.number().positive().max(10000).min(0.01),
    type: z.enum(['withdraw', 'deposit']),
    paymentMethod: z.enum(['credit_card', 'debit_card', 'account_cash', 'pix', 'other']),
    accountId: z.string().max(200)
});

export type TransactionCreateSchemaType = z.infer<typeof TransactionCreateSchema>;