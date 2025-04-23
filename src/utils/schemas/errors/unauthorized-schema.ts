import { z } from 'zod';

export const UnauthorizedSchema = z.object({
    message: z.string()
}).describe('Unauthorized');

export type UnauthorizedSchemaType = z.infer<typeof UnauthorizedSchema>;
