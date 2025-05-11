import { AccountRepository } from '../../repositories/account-repository';
import { TransactionRepository, TransactionsAndCount } from '../../repositories/transaction-repository';
import { AccountNotFoundError } from '../../utils/errors/account-not-found-error';
import { GetPaginatedTransactionsInternalType } from '../../utils/schemas/internal/transactions/get-paginated-transactions.schema';

export class GetTransactionsUseCase {
    constructor(private transactionRepository: TransactionRepository, private accountRepository: AccountRepository) {}

    async execute(data: GetPaginatedTransactionsInternalType): Promise<TransactionsAndCount> {
        const accountExists = await this.accountRepository.get(data.accountId);
        if (!accountExists) {
            throw new AccountNotFoundError();
        }

        const transactions = await this.transactionRepository.getPaginated(data);
        return transactions;
    }
}