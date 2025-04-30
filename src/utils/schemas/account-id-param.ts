import { z } from 'zod';

export const AccountIdParamZod = z.object({
    accountId: z.string().max(200)
});

export type AccountIdParam = z.infer<typeof AccountIdParamZod>;