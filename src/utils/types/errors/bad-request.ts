import { z } from 'zod';

export const ZBadRequest = z.object({
    message: z.literal('Bad Request'),
    errors: z.array(
      z.object({
          path: z.string(),
          message: z.string()
      })
  )
}).describe('Bad Request');