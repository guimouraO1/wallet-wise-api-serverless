import { FindManyTransactionsSchemaType } from '../utils/schemas/transactions/find-many-transactions-schema';

export type TransactionType = 'withdraw' | 'deposit';
export type PaymentMethod = 'credit_card' | 'debit_card' | 'account_cash' | 'pix' | 'other';

export type Transaction = {
    name: string;
    id: string;
    description: string | null;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
    type: TransactionType;
    paymentMethod: PaymentMethod;
    accountId: string;
}

export type TransactionsAndCount = {
    transactionsCount: number;
    transactions: Transaction[];
}

export type TransactionCreateInput = {
    name: string;
    description?: string | null;
    amount: number;
    type: TransactionType;
    paymentMethod: PaymentMethod;
    accountId: string;
  }

export interface TransactionRepository {
    create(data: TransactionCreateInput): Promise<Transaction>;
    findManyByAccountId(data: FindManyTransactionsSchemaType): Promise<TransactionsAndCount>;
    findManyInPeriodByAccountId(accountId: string, startDate: Date, endDate: Date): Promise<TransactionsAndCount>;
    delete(transactionId: string): Promise<Transaction | null>;
}