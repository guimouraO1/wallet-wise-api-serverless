import { z } from 'zod';

export const PayInvoiceBody = z.object({
    accountId: z.string().min(3).max(200),
    billId:    z.string().min(3).max(200)
});

export type PayInvoiceBodyType = z.infer<typeof PayInvoiceBody>;