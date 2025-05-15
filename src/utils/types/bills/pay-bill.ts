import { z } from 'zod';

export const ZPayBill = z.object({
    billId:    z.string().min(3).max(200)
});

export type PayBill = z.infer<typeof ZPayBill>;