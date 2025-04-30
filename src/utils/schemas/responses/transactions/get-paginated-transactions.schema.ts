import { z } from 'zod';

export const GetPaginatedTransactionsResponse = z.object({
    transactionsCount: z.number(),
    transactions: z.array(
            z.object({
                id: z.string(),
                name: z.string(),
                description: z.string().nullable(),
                amount: z.number(),
                createdAt: z.date(),
                updatedAt: z.date(),
                type: z.string(),
                paymentMethod: z.string(),
                accountId: z.string()
            })
        )
});
