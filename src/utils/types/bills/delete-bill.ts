import { z } from 'zod';

export const ZDeleteBillParams = z.object({
    accountId: z.string().min(3).max(200),
    id:        z.string().min(3).max(200)
});

export type DeleteBillParams = z.infer<typeof ZDeleteBillParams>;
