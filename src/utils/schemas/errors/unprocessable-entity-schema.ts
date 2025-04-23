import { z } from 'zod';

export const UnprocessableEntitySchema = z.object({
    message: z.string()
}).describe('Unprocessable Entity');

export type UnprocessableEntitySchemaType = z.infer<typeof UnprocessableEntitySchema>;
