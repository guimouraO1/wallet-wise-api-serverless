import { GetTransactionsInPeriodInternalType } from '../utils/schemas/internal/transactions/get-transactions-in-period.schema';
import { GetPaginatedTransactionsInternalType } from '../utils/schemas/internal/transactions/get-paginated-transactions.schema';
import { GetTransactionsSummaryByAccountIdAndYearType } from '../utils/schemas/internal/transactions/get-transactions-summary-by-account-id-and-year.schema';
import { GetTransactionsSummaryByAccountIdAndYearResponseType }
    from '../utils/schemas/responses/transactions/get-transactions-summary-by-account-id-and-year.schema';

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
    getByAccountId(data: GetPaginatedTransactionsInternalType): Promise<TransactionsAndCount>;
    getByAccountIdInPeriod(data: GetTransactionsInPeriodInternalType): Promise<TransactionsAndCount>;
    getTransactionsSummaryByAccountIdAndYear(data : GetTransactionsSummaryByAccountIdAndYearType): Promise<GetTransactionsSummaryByAccountIdAndYearResponseType>
    delete(transactionId: string): Promise<Transaction | null>;
}