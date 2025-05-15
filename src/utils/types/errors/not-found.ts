import { z } from 'zod';

export const ZNotFound = z.object({ message: z.string() }).describe('Not Found');