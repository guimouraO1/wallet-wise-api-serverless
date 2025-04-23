import { z } from 'zod';

export const BadRequestSchema = z.object({
    message: z.string(),
    status: z.number(),
    errors: z.array(
    z.object({
        key: z.string().optional(),
        value: z.string()
    })
  )
}).describe('Bad Request');

export type BadRequestSchemaType = z.infer<typeof BadRequestSchema>;
