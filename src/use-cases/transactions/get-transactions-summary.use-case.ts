import { AccountRepository } from '../../repositories/account-repository';
import { TransactionRepository } from '../../repositories/transaction-repository';
import { AccountNotFoundError } from '../../utils/errors/account-not-found-error';
import { GetTransactionsSummary } from '../../utils/types/transactions/internal/get-transactions-summary';

export class GetTransactionsSummaryUseCase {
    constructor(private transactionsRepository: TransactionRepository, private accountRepository: AccountRepository) {}

    async execute({ accountId, year, type }: GetTransactionsSummary) {
        const accountExists = await this.accountRepository.get(accountId);
        if (!accountExists) {
            throw new AccountNotFoundError();
        }

        const response = await this.transactionsRepository.getSummary({ accountId, year, type });
        return response;
    }
}