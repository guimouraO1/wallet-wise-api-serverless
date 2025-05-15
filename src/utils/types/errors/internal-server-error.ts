import { z } from 'zod';

export const ZInternalServerError = z.object({ message: z.string() }).describe('Internal Server Error');