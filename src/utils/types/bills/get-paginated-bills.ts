import { z } from 'zod';

export const ZGetPaginatedBills = z.object({
    page:      z.string().regex(/^\d+$/).min(1).max(10_000),
    offset:    z.enum(['5', '10', '25']),
    billType:  z.enum(['installment', 'recurring']).optional(),
    frequency: z.enum(['annual', 'monthly', 'weekly']).optional(),
    name:      z.string().min(3).max(100).optional(),
    active:    z.enum(['true', 'false']).optional()
});

