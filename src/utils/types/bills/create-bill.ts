import { z } from 'zod';

export const ZCreateBill = z.object({
    accountId: z.string().min(3).max(200),
    name: z.string().min(3).max(100),
    description: z.string().max(500).nullable().optional(),
    amount: z.number().min(0.01).max(10_000),
    billType: z.enum(['recurring', 'installment']),
    dueDay: z.number().min(1).max(31),
    frequency: z.enum(['monthly', 'weekly', 'annual']),
    installments: z.number().int().min(1).nullable().optional(),
    paidInstallments: z.number().int().min(0),
    active: z.boolean().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
});

export type CreateBill = z.infer<typeof ZCreateBill>;
