import { z } from 'zod';
import { dateRegex } from '../../bills/get-bills-in-period';

export const ZGetTransactionsInPeriodInternal = z.object({
    accountId:      z.string().min(3).max(200),
    startDate:      z.string().regex(dateRegex, 'A data deve estar no formato DD-MM-YYYY'),
    endDate:        z.string().regex(dateRegex, 'A data deve estar no formato DD-MM-YYYY'),
    type:           z.enum(['deposit', 'withdraw']).optional()
});
export type GetTransactionsInPeriodInternal = z.infer<typeof ZGetTransactionsInPeriodInternal>;