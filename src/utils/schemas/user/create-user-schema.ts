import { z } from 'zod';

export const CreateUserRequestSchema = z.object({
    email: z.string().email().max(50),
    password: z.string().min(6).max(50),
    name: z.string().max(100),
    avatarUrl: z.string().url().nullish()
});

export type CreateUserRequestSchemaType = z.infer<typeof CreateUserRequestSchema>;