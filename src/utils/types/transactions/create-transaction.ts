import { z } from 'zod';

export const ZCreateTransaction = z.object({
    accountId: z.string().min(3).max(200),
    name: z.string().min(3).max(100),
    description: z.string().max(500).nullable().optional(),
    amount: z.number().min(0.01).max(10_000),
    paymentMethod: z.enum(['account_cash', 'credit_card', 'debit_card', 'pix', 'other']),
    type: z.enum(['deposit', 'withdraw'])
});

export type CreateTransaction = z.infer<typeof ZCreateTransaction>;