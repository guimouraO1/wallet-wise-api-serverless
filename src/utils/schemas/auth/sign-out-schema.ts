import { z } from 'zod';

export const SignOutResponseSchema = z.object({}).describe('Successfully sign out');

export type SignOutResponseSchemaType = z.infer<typeof SignOutResponseSchema>;