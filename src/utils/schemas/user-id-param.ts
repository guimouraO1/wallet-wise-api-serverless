import { z } from 'zod';

export const UserIdParam = z.object({ userId: z.string() });
export type UserIdParamZod = z.infer<typeof UserIdParam>;