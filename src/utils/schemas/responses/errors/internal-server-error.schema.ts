import { z } from 'zod';

export const InternalServerErrorSchema = z.object({ message: z.string() }).describe('Internal Server Error');