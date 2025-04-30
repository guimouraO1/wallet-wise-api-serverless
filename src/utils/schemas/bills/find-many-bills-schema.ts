import { z } from 'zod';

export const FindManyBillsInputZod = z.object({
    page: z.string().regex(/^\d+$/).max(10000),
    offset: z.enum(['5', '10', '25']),
    name: z.string().min(1).max(100).optional(),
    active: z.string().optional(),
    billType: z.enum(['recurring', 'installment']).optional(),
    frequency: z.enum(['monthly', 'weekly', 'annual']).optional()
});

export type FindManyBillsInput = z.infer<typeof FindManyBillsInputZod>;

export const BillsZod = z.object({
    name: z.string(),
    id: z.string(),
    description: z.string().nullable(),
    amount: z.number(),
    dueDay: z.number().nullable().optional(),
    billType: z.enum(['recurring', 'installment']),
    frequency: z.enum(['monthly', 'weekly', 'annual']),
    active: z.boolean(),
    accountId: z.string(),
    installments: z.number().nullable(),
    paidInstallments: z.number().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
});

export const FindManyBillsResponseZod = z.object({
    billsCount: z.number(),
    bills: z.array(BillsZod)
});

