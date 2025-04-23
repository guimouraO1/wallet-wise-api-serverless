import { z } from 'zod';

export const CreatedSchema = z.object({});

export type CreatedSchemaType = z.infer<typeof CreatedSchema>;