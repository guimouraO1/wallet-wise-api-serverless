import { z } from 'zod';

export const ParamUserIdRequestSchema = z.object({
    userId: z.string()
});

export type ParamUserIdRequestSchemaType = z.infer<typeof ParamUserIdRequestSchema>;