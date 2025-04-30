import { z } from 'zod';

export const GetPaginatedTransactionsQuery = z.object({
    name:          z.string().min(3).max(100).nullable().optional(),
    page:          z.string().regex(/^\d+$/).min(1).max(10_000),
    offset:        z.enum(['5', '10', '25']),
    paymentMethod: z.enum(['account_cash', 'credit_card', 'debit_card', 'other', 'pix']).nullable().optional(),
    type:          z.enum(['deposit', 'withdraw']).nullable().optional()
});

export type GetPaginatedTransactionsQueryType = z.infer<typeof GetPaginatedTransactionsQuery>;