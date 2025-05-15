import { CreateTransaction } from '../utils/types/transactions/create-transaction';
import { GetTransactionsResponse } from '../utils/types/transactions/get-transactions';
import { GetTransactionsSummaryResponse } from '../utils/types/transactions/get-transactions-summary-response';
import { GetPaginatedTransactionsInternal } from '../utils/types/transactions/internal/get-paginated-transactions';
import { GetTransactionsInPeriodInternal } from '../utils/types/transactions/internal/get-transactions-in-period';
import { GetTransactionsSummary } from '../utils/types/transactions/internal/get-transactions-summary';
import { Transaction } from '../utils/types/transactions/transaction';

export interface TransactionRepository {
    create(data: CreateTransaction): Promise<Transaction>;
    getById(transactionId: string): Promise<Transaction | null>;
    getPaginated(data: GetPaginatedTransactionsInternal): Promise<GetTransactionsResponse>;
    getInPeriod(data: GetTransactionsInPeriodInternal): Promise<GetTransactionsResponse>;
    getSummary(data : GetTransactionsSummary): Promise<GetTransactionsSummaryResponse>
    delete(transactionId: string): Promise<Transaction | null>;
}