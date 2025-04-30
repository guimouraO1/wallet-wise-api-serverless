import { z } from 'zod';
import { GetAccountResponse } from '../account/get-account.schema';

export const GetUserByIdResponse = z.object({
    Account: z.array(GetAccountResponse),
    name: z.string(),
    id: z.string(),
    email: z.string(),
    role: z.enum(['admin', 'standard']),
    created_at: z.date(),
    updated_at: z.date(),
    avatarUrl: z.string().nullable().optional(),
    email_already_verifyed: z.boolean()
});

export type GetUserByIdResponseType = z.infer<typeof GetUserByIdResponse>;