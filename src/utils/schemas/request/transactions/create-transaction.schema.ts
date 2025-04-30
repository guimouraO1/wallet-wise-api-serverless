import { z } from 'zod';

export const CreateTransactionBody = z.object({
    accountId:     z.string().min(3).max(200),
    name:          z.string().min(3).max(100),
    description:   z.string().min(1).max(500).nullable().optional(),
    amount:        z.number().min(0.01).max(10_000),
    paymentMethod: z.enum(['account_cash', 'credit_card', 'debit_card', 'other', 'pix']),
    type:          z.enum(['deposit', 'withdraw'])
});

export type CreateTransactionBodyType = z.infer<typeof CreateTransactionBody>;