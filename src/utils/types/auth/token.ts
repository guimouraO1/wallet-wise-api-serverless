import { z } from 'zod';

export const ZTokenObject = z.object({ token: z.string() });