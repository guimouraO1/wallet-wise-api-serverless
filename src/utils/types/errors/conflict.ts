import { z } from 'zod';

export const ZConflict = z.object({ message: z.string() }).describe('Conflict');