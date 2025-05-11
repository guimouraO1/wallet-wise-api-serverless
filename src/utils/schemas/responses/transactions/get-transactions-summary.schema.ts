import { z } from 'zod';

export const GetTransactionsSummaryResponse = z.array(
    z.object({
        name: z.string(),
        value: z.number()
    })
);

export type GetTransactionsSummaryResponseType = z.infer<typeof GetTransactionsSummaryResponse>;
