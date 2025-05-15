import { z } from 'zod';
import { ZUser } from './user';

export const ZCreateUser = ZUser.pick({
    name: true,
    email: true,
    password: true,
    avatarUrl: true
});

export type CreateUser = z.infer<typeof ZCreateUser>;