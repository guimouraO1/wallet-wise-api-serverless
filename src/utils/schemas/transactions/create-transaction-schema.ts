import { z } from 'zod';

export const TransactionCreateSchema = z.object({
    name: z.string().max(100),
    description: z.string().max(255).nullish(),
    amount: z.number().positive(),
    type: z.enum(['withdraw', 'deposit']),
    paymentMethod: z.enum(['credit_card', 'debit_card', 'account_cash', 'pix', 'other']),
    accountId: z.string()
});

export type TransactionCreateSchemaType = z.infer<typeof TransactionCreateSchema>;