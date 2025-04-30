import { z } from 'zod';

export const DeleteBillZod = z.object({
    accountId: z.string().max(200),
    id: z.string().max(200)
});

export type DeleteBillParams = z.infer<typeof DeleteBillZod>;
