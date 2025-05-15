import { z } from 'zod';

export const ZGetTransactionsSummaryResponse = z.array(z.object({ name: z.string(), value: z.number() }));

export type GetTransactionsSummaryResponse = z.infer<typeof ZGetTransactionsSummaryResponse>;
