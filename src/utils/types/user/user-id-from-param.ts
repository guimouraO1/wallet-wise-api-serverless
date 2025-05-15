import { z } from 'zod';

export const ZUserIdFromParam = z.object({
    userId: z.string().min(3).max(200)
});

export type UserIdFromParam = z.infer<typeof ZUserIdFromParam>;