import { z } from 'zod';

export const ZForbidden = z.object({ message: z.string() }).describe('Forbidden');