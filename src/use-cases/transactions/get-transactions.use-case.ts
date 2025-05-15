import { AccountRepository } from '../../repositories/account-repository';
import { TransactionRepository } from '../../repositories/transaction-repository';
import { AccountNotFoundError } from '../../utils/errors/account-not-found-error';
import { GetPaginatedTransactionsInternal } from '../../utils/types/transactions/internal/get-paginated-transactions';

export class GetTransactionsUseCase {
    constructor(private transactionRepository: TransactionRepository, private accountRepository: AccountRepository) {}

    async execute(data: GetPaginatedTransactionsInternal) {
        const accountExists = await this.accountRepository.get(data.accountId);
        if (!accountExists) {
            throw new AccountNotFoundError();
        }

        const transactions = await this.transactionRepository.getPaginated(data);
        return transactions;
    }
}