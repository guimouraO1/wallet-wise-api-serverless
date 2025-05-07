import { z } from 'zod';
import { dateRegex } from '../../request/bills/get-bills-in-period.schema';

export const GetTransactionsInPeriodInternal = z.object({
    accountId:      z.string().min(3).max(200),
    startDate:      z.string().regex(dateRegex, 'A data deve estar no formato DD-MM-YYYY'),
    endDate:        z.string().regex(dateRegex, 'A data deve estar no formato DD-MM-YYYY'),
    type:           z.enum(['deposit', 'withdraw']).optional()
});
export type GetTransactionsInPeriodInternalType = z.infer<typeof GetTransactionsInPeriodInternal>;