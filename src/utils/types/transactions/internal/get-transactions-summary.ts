import { z } from 'zod';

export const ZGetTransactionsSummary = z.object({
    accountId: z.string().min(3).max(200),
    year: z.string(),
    type: z.enum(['deposit', 'withdraw']).optional()
});

export type GetTransactionsSummary = z.infer<typeof ZGetTransactionsSummary>;
