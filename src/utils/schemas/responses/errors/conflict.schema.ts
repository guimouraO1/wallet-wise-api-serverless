import { z } from 'zod';

export const ConflictSchema = z.object({
    message: z.string()
}).describe('Conflict');

export type ConflictSchemaType = z.infer<typeof ConflictSchema>;
