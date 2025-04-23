import { z } from 'zod';
import { AccountResponseSchema } from '../account/account-schema';

export const GetUserByIdResponseZod = z.object({
    Account: z.array(AccountResponseSchema),
    name: z.string(),
    id: z.string(),
    email: z.string(),
    role: z.enum(['admin', 'standard']),
    created_at: z.date(),
    updated_at: z.date(),
    avatarUrl: z.string().nullable().optional(),
    email_already_verifyed: z.boolean()
});

export type GetUserByIdResponse = z.infer<typeof GetUserByIdResponseZod>;