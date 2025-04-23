import { z } from 'zod';

const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

export const FindManyInPeriodTransactionsZod = z.object({
    startDate: z.string().regex(dateRegex, 'A data deve estar no formato DD-MM-YYYY'),
    endDate: z.string().regex(dateRegex, 'A data deve estar no formato DD-MM-YYYY')
});
export type FindManyInPeriodTransactionsQueryParams = z.infer<typeof FindManyInPeriodTransactionsZod>;

