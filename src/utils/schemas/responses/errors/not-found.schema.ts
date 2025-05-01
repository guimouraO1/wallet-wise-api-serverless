import { z } from 'zod';

export const NotFoundSchema = z.object({ message: z.string() }).describe('Not Found');