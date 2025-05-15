import { z } from 'zod';

export const ZUpdateAccount = z.object({
    balance: z.number().min(0.01).max(10_000),
    type: z.enum(['deposit', 'withdraw']),
    accountId: z.string().min(3).max(200)
});

export type UpdateAccount = z.infer<typeof ZUpdateAccount>;