import { z } from 'zod';

export const AuthenticateRequestBodyZod = z.object({
    email: z.string().email().max(50),
    password: z.string().min(6).max(50)
});

export type AuthenticateRequestBody = z.infer<typeof AuthenticateRequestBodyZod>;