import { z } from 'zod';

export const ZUnauthorized = z.object({ message: z.string() }).describe('Unauthorized');