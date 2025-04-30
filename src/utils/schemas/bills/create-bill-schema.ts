import { z } from 'zod';

export const BillCreateInputZod = z.object({
    accountId: z.string().max(200),
    name: z.string().max(100),
    description: z.string().max(255).nullable().optional(),
    amount: z.number().max(10000),
    billType: z.enum(['recurring', 'installment']),
    dueDay: z.number().nullable(),
    frequency: z.enum(['monthly', 'weekly', 'annual']),
    installments: z.number().max(100).nullable().optional(),
    paidInstallments: z.number().max(99),
    active: z.boolean()
}).refine((data) => {
    if (data.billType === 'installment') {
        return (data.installments && data.installments >= data.paidInstallments);
    }

    return true; },
    {
        message: 'For installment bills, installments must be defined and greater than paidInstallments.',
        path: ['installments']
    });

export type BillCreateInput = z.infer<typeof BillCreateInputZod>;