import { z } from 'zod';

export const GetPaginatedTransactionsInternal = z.object({
    accountId:      z.string().min(3).max(200),
    name:           z.string().min(3).max(100).nullable().optional(),
    offset:         z.number().min(1).max(10_000),
    page:           z.number().min(1).max(10_000),
    paymentMethod:  z.enum(['account_cash', 'credit_card', 'debit_card', 'other', 'pix']).nullable().optional(),
    type:           z.enum(['deposit', 'withdraw']).nullable().optional()
});
export type GetPaginatedTransactionsInternalType = z.infer<typeof GetPaginatedTransactionsInternal>;