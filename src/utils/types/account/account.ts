import { z } from 'zod';

export const ZAccount = z.object({
    id: z.string(),
    balance: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
    userId: z.string()
});

export type Account = z.infer<typeof ZAccount>;
