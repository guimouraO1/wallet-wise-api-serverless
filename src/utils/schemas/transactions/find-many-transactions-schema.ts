import { z } from 'zod';

export const FindManyTransactionsSchema = z.object({
    accountId: z.string().max(200),
    page: z.number(),
    offset: z.number(),
    type: z.enum(['withdraw', 'deposit']).nullable().optional(),
    paymentMethod: z.enum(['credit_card', 'debit_card', 'account_cash', 'pix', 'other']).nullable().optional(),
    name: z.string().min(1).nullable().optional()
});

export const FindManyTransactionsRequestSchema = z.object({
    page: z.string().regex(/^\d+$/).max(10000),
    offset: z.enum(['5', '10', '25']),
    type: z.enum(['withdraw', 'deposit']).nullable().optional(),
    paymentMethod: z.enum(['credit_card', 'debit_card', 'account_cash', 'pix', 'other']).nullable().optional(),
    name: z.string().min(1).max(200).nullable().optional()
});

export type FindManyTransactionsSchemaType = z.infer<typeof FindManyTransactionsSchema>;
export type FindManyTransactionsRequestSchemaType = z.infer<typeof FindManyTransactionsRequestSchema>;

export const FindManyTransactionsResponseSchema = z.object({
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
