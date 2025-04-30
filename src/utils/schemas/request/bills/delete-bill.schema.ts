import { z } from 'zod';

export const DeleteBillParam = z.object({
    accountId: z.string().min(3).max(200),
    id:        z.string().min(3).max(200)
});

export type DeleteBillParamType = z.infer<typeof DeleteBillParam>;
