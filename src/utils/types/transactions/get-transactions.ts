import { z } from 'zod';
import { ZTransaction } from './transaction';

export const ZGetTransactionsResponse = z.object({
    transactionsCount: z.number(),
    transactions: z.array(ZTransaction)
});

export type GetTransactionsResponse = z.infer<typeof ZGetTransactionsResponse>;