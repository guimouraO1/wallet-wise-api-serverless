import { z } from 'zod';

export const DeletedSchemaZod = z.object({});

export type DeletedSchema = z.infer<typeof DeletedSchemaZod>;