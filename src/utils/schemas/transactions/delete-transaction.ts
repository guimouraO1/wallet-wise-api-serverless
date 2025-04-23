import { z } from 'zod';

export const DeleteTransactionZod = z.object({
    transactionId: z.string(),
    accountId: z.string()
});

export type DeleteTransactionParams = z.infer<typeof DeleteTransactionZod>;

export const DeleteTransactionResponseZod = z.object({});