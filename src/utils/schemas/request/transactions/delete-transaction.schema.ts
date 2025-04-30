import { z } from 'zod';

export const DeleteTransactionParams = z.object({
    accountId:     z.string().min(3).max(200),
    transactionId: z.string().min(3).max(200)
});

export type DeleteTransactionParamsType = z.infer<typeof DeleteTransactionParams>;