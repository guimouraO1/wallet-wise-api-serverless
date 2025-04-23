import { z } from 'zod';

export const DeleteBillZod = z.object({
    accountId: z.string().max(300),
    id: z.string().max(300)
});

export type DeleteBillParams = z.infer<typeof DeleteBillZod>;
