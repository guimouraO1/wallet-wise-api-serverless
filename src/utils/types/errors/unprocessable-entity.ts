import { z } from 'zod';

export const ZUnprocessableEntity = z.object({ message: z.string() }).describe('Unprocessable Entity');