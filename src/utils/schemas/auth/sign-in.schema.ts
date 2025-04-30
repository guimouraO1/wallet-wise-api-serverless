import { z } from 'zod';

export const AuthenticateRequestBodyZod = z.object({
    email: z.string().email().max(200),
    password: z.string().min(6).max(100)
});

export type AuthenticateRequestBody = z.infer<typeof AuthenticateRequestBodyZod>;