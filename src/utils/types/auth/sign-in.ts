import { z } from 'zod';

export const ZSignIn = z.object({
    email:    z.string().email().max(200),
    password: z.string().min(6).max(100)
});

export type SignIn = z.infer<typeof ZSignIn>;