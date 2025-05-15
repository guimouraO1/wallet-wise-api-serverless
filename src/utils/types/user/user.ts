import { z } from 'zod';
import { ZAccount } from '../account/account';

export enum Role {
    ADMIN = 'admin',
    STANDARD = 'standard'
}

export const ZUser = z.object({
    id: z.string(),
    name: z.string().min(3).max(100),
    email: z.string().email().max(50),
    password: z.string().min(6).max(100),
    avatarUrl: z.string().url().nullable().optional(),
    role: z.enum(['admin', 'standard']),
    created_at: z.date(),
    updated_at: z.date(),
    email_already_verifyed: z.boolean(),
    Account: z.array(ZAccount)
});

export type User = z.infer<typeof ZUser>;