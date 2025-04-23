import { z } from 'zod';

export const TokenResponseSchema = z.object({ token: z.string() }).describe('Successfully refresh token');

export type TokenResponseSchemaType = z.infer<typeof TokenResponseSchema>;