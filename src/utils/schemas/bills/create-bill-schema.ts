import { z } from 'zod';

export const BillCreateInputZod = z.object({
    accountId: z.string(),
    name: z.string().max(100),
    description: z.string().max(255).nullable().optional(),
    amount: z.number(),
    billType: z.enum(['recurring', 'installment']),
    dueDay: z.number().nullable(),
    frequency: z.enum(['monthly', 'weekly', 'annual']),
    installments: z.number().nullable().optional(),
    paidInstallments: z.number(),
    active: z.boolean()
}).refine((data) => {
    if (data.billType === 'installment') {
        return (typeof data.installments === 'number' && data.installments >= data.paidInstallments);
    }

    return true; }, {
        message: 'For installment bills, installments must be defined and greater than paidInstallments.',
        path: ['installments']
    });

export type BillCreateInput = z.infer<typeof BillCreateInputZod>;