import { z } from 'zod';

export const AccountIdParam = z.object({
    accountId: z.string().min(1).max(200)
});

export type AccountIdParamType = z.infer<typeof AccountIdParam>;