import { z } from 'zod';

export const InternalServerErrorSchema = z.object({
    message: z.string()
}).describe('Internal Server Error');

export type InternalServerErrorSchemaType = z.infer<typeof InternalServerErrorSchema>;
