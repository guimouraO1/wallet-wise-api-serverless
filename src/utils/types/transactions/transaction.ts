import { z } from 'zod';

export enum TransactionTypeEnum {
  Withdraw = 'withdraw',
  Deposit = 'deposit'
}

export enum PaymentMethodEnum {
  CreditCard = 'credit_card',
  DebitCard = 'debit_card',
  AccountCash = 'account_cash',
  Pix = 'pix',
  Other = 'other',
}

export const ZTransaction = z.object({
    accountId: z.string(),
    id: z.string(),
    name: z.string().min(3).max(100),
    description: z.string().max(500).nullable().optional(),
    amount: z.number().min(0.01).max(10_000),
    paymentMethod: z.enum(['account_cash', 'credit_card', 'debit_card', 'pix', 'other']),
    type: z.enum(['deposit', 'withdraw']),
    createdAt: z.date(),
    updatedAt: z.date()
});

export type Transaction = z.infer<typeof ZTransaction>;