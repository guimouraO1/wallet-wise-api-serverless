import { z } from 'zod';

export const CreateUserBody = z.object({
    avatarUrl: z.string().url().nullable().optional(),
    email:     z.string().email().max(50),
    name:      z.string().min(3).max(100),
    password:  z.string().min(6).max(50)
});

export type CreateUserBodyType = z.infer<typeof CreateUserBody>;