import { AccountRepository } from '../../repositories/account-repository';
import { TransactionRepository } from '../../repositories/transaction-repository';
import { AccountNotFoundError } from '../../utils/errors/account-not-found-error';
import { GetTransactionsSummaryByAccountIdAndYearType } from '../../utils/schemas/internal/transactions/get-transactions-summary-by-account-id-and-year.schema';

export class GetTransactionsSummaryByAccountIdAndYear {
    constructor(private transactionsRepository: TransactionRepository, private accountRepository: AccountRepository) {}

    async execute({ accountId, year, type }: GetTransactionsSummaryByAccountIdAndYearType) {
        const accountExists = await this.accountRepository.getByAccountId(accountId);
        if (!accountExists) {
            throw new AccountNotFoundError();
        }

        const response = await this.transactionsRepository.getTransactionsSummaryByAccountIdAndYear({ accountId, year, type });
        return response;
    }
}