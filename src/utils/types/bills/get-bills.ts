import { z } from 'zod';
import { ZBill } from './bill';

export const ZGetBills = z.object({
    billsCount: z.number(),
    bills: z.array(ZBill)
});

