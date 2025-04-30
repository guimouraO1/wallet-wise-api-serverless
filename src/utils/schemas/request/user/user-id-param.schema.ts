import { z } from 'zod';

export const UserIdParam = z.object({
    userId: z.string().min(3).max(200)
});

export type UserIdParamZod = z.infer<typeof UserIdParam>;