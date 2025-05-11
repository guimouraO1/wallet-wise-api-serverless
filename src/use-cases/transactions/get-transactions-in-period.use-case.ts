
import { AccountRepository } from '../../repositories/account-repository';
import { TransactionRepository } from '../../repositories/transaction-repository';
import { AccountNotFoundError } from '../../utils/errors/account-not-found-error';
import { GetTransactionsInPeriodInternalType } from '../../utils/schemas/internal/transactions/get-transactions-in-period.schema';

export class GetTransactionsInPeriodUseCase {
    constructor(private transactionRepository: TransactionRepository, private accountRepository: AccountRepository)  {}

    async execute({ accountId, startDate, endDate, type }: GetTransactionsInPeriodInternalType) {
        const accountExists = await this.accountRepository.get(accountId);
        if (!accountExists) {
            throw new AccountNotFoundError();
        }

        const transactions = await this.transactionRepository.getInPeriod({ accountId, startDate, endDate, type });
        return transactions;
    }
}