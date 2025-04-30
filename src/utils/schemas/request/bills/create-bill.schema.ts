import { z } from 'zod';

export const CreateBillBody = z.object({
    accountId:        z.string().min(3).max(200),
    description:      z.string().min(1).max(500).nullable().optional(),
    name:             z.string().min(3).max(100),
    amount:           z.number().min(0.01).max(10_000),
    dueDay:           z.number().min(1).max(31).nullable(),
    installments:     z.number().max(100).nullable().optional(),
    paidInstallments: z.number().max(99),
    billType:         z.enum(['installment', 'recurring']),
    frequency:        z.enum(['annual', 'monthly', 'weekly']),
    active:           z.boolean()
})
.refine(
  (data) => {
      if (data.billType === 'installment') {
          return data.installments && data.installments >= data.paidInstallments;
      }
      return true;
  },
    {
        message: 'For installment bills, installments must be defined and greater than paidInstallments.',
        path: ['installments']
    }
);