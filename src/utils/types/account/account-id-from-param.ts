import { z } from 'zod';

export const ZAccountIdFromParam = z.object({
    accountId: z.string().min(1).max(200)
});

export type AccountIdFromParam = z.infer<typeof ZAccountIdFromParam>;