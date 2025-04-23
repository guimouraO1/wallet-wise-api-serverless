import { z } from 'zod';

export const PayInvoiceZod = z.object({
    accountId: z.string().max(300),
    billId: z.string().max(300)
});

export type PayInvoiceParams = z.infer<typeof PayInvoiceZod>;
