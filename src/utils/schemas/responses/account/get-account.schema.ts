import { z } from 'zod';

export const GetAccountResponse = z.object({
    id: z.string(),
    balance: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
    userId: z.string()
});