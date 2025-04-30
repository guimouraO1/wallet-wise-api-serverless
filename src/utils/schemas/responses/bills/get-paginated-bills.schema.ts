import { z } from 'zod';

export const BillsResponse = z.object({
    name: z.string(),
    id: z.string(),
    description: z.string().nullable().optional(),
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

export const GetPaginatedBillsResponse = z.object({
    billsCount: z.number(),
    bills: z.array(BillsResponse)
});

