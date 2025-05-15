import { z } from 'zod';

export enum BillTypeEnum {
  Recurring = 'recurring',
  Installment = 'installment',
}

export enum BillFrequencyEnum {
  Monthly = 'monthly',
  Weekly = 'weekly',
  Annual = 'annual'
}

export const ZBill = z.object({
    accountId: z.string().min(3).max(200),
    id:        z.string().min(3).max(200),
    name: z.string().min(3).max(100),
    description: z.string().max(500).nullable().optional(),
    amount: z.number().min(0.01).max(10_000),
    billType: z.enum(['recurring', 'installment']),
    dueDay: z.number().min(1).max(31).nullable().optional(),
    frequency: z.enum(['monthly', 'weekly', 'annual']).nullable().optional(),
    installments: z.number().int().min(1).nullable(),
    paidInstallments: z.number().int().min(0),
    active: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deleted: z.boolean().optional()
});

export type Bill = z.infer<typeof ZBill>;
