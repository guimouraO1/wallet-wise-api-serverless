import { z } from 'zod';

export const ZObjectVoid = z.object({});

export type ObjectVoid = z.infer<typeof ZObjectVoid>;