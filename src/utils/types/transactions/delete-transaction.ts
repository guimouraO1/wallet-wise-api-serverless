import { z } from 'zod';

export const ZDeleteTransactionParams = z.object({ accountId: z.string().min(3).max(200), transactionId: z.string().min(3).max(200) });

export type DeleteTransactionParams = z.infer<typeof ZDeleteTransactionParams>;