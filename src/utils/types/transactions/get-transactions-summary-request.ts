import { z } from 'zod';

export const ZGetTransactionsSummary = z.object({
    year: z.string()  .length(4)
    .regex(/^\d{4}$/, 'Year must be a 4-digit. example: "2025"').refine((val) => {
        const year = parseInt(val, 10);
        return year >= 2001 && year <= 2999;
    }, 'Year must be between 2001 and 2999'),

    type: z.enum(['deposit', 'withdraw']).optional()
});

export type GetTransactionsSummary = z.infer<typeof ZGetTransactionsSummary>;
