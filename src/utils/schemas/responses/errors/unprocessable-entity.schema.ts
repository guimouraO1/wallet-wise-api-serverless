import { z } from 'zod';

export const UnprocessableEntity = z.object({ message: z.string() }).describe('Unprocessable Entity');