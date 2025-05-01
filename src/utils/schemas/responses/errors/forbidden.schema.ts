import { z } from 'zod';

export const ForbiddenSchema = z.object({ message: z.string() }).describe('Forbidden');