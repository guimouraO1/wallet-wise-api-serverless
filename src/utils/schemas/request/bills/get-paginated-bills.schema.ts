import { z } from 'zod';

export const GetPaginatedBillsQuery = z.object({
    active:    z.enum(['true', 'false']).optional(), // Lembrar type boolean
    name:      z.string().min(3).max(100).optional(),
    page:      z.string().regex(/^\d+$/).min(1).max(10_000),
    billType:  z.enum(['installment', 'recurring']).optional(),
    frequency: z.enum(['annual', 'monthly', 'weekly']).optional(),
    offset:    z.enum(['10', '25', '5'])
});

