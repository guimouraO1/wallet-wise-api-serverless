import { z } from 'zod';

export const SignInBody = z.object({
    email:    z.string().email().max(200),
    password: z.string().min(6).max(100)
});

export type SignInBodyType = z.infer<typeof SignInBody>;