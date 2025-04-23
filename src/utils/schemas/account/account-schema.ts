import { z } from 'zod';

export const AccountResponseSchema = z.object({
    id: z.string(),
    balance: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
    userId: z.string()
});