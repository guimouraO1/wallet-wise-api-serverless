import { GetTransactionsInPeriodInternalType } from '../utils/schemas/internal/transactions/get-transactions-in-period.schema';
import { GetPaginatedTransactionsInternalType } from '../utils/schemas/internal/transactions/get-paginated-transactions.schema';
import { GetTransactionsSummaryType } from '../utils/schemas/internal/transactions/get-transactions-summary.schema';
import { GetTransactionsSummaryResponseType }
    from '../utils/schemas/responses/transactions/get-transactions-summary.schema';

export type TransactionType = 'withdraw' | 'deposit';
export type PaymentMethod = 'credit_card' | 'debit_card' | 'account_cash' | 'pix' | 'other';

export enum PaymentMethodEnum {
  CreditCard = 'credit_card',
  DebitCard = 'debit_card',
  AccountCash = 'account_cash',
  Pix = 'pix',
  Other = 'other',
}

export enum TransactionTypeEnum {
  Withdraw = 'withdraw',
  Deposit = 'deposit'
}

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
    description?: string;
    amount: number;
    type: TransactionType;
    paymentMethod: PaymentMethod;
    accountId: string;
}

export interface TransactionRepository {
    create(data: TransactionCreateInput): Promise<Transaction>;
    getById(transactionId: string): Promise<Transaction | null>;
    getPaginated(data: GetPaginatedTransactionsInternalType): Promise<TransactionsAndCount>;
    getInPeriod(data: GetTransactionsInPeriodInternalType): Promise<TransactionsAndCount>;
    getSummary(data : GetTransactionsSummaryType): Promise<GetTransactionsSummaryResponseType>
    delete(transactionId: string): Promise<Transaction | null>;
}