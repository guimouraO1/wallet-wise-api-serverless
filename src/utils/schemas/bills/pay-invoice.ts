import { z } from 'zod';

export const PayInvoiceZod = z.object({
    accountId: z.string().max(200),
    billId: z.string().max(200)
});

export type PayInvoiceParams = z.infer<typeof PayInvoiceZod>;
