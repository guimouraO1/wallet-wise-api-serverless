import { z } from 'zod';

export const GetTransactionsSummaryByAccountIdAndYearResponse = z.array(
    z.object({
        name: z.string(),
        value: z.number()
    })
);

export type GetTransactionsSummaryByAccountIdAndYearResponseType = z.infer<typeof GetTransactionsSummaryByAccountIdAndYearResponse>;
