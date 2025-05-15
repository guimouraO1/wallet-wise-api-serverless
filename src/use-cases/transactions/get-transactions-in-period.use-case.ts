
import { AccountRepository } from '../../repositories/account-repository';
import { TransactionRepository } from '../../repositories/transaction-repository';
import { AccountNotFoundError } from '../../utils/errors/account-not-found-error';
import { GetTransactionsInPeriodInternal } from '../../utils/types/transactions/internal/get-transactions-in-period';

export class GetTransactionsInPeriodUseCase {
    constructor(private transactionRepository: TransactionRepository, private accountRepository: AccountRepository)  {}

    async execute({ accountId, startDate, endDate, type }: GetTransactionsInPeriodInternal) {
        const accountExists = await this.accountRepository.get(accountId);
        if (!accountExists) {
            throw new AccountNotFoundError();
        }

        const transactions = await this.transactionRepository.getInPeriod({ accountId, startDate, endDate, type });
        return transactions;
    }
}