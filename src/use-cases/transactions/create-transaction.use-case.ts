import { AccountRepository } from '../../repositories/account-repository';
import { TransactionRepository } from '../../repositories/transaction-repository';
import { AccountNotFoundError } from '../../utils/errors/account-not-found-error';
import { CreateTransactionError } from '../../utils/errors/create-transaction-error';
import { YouAreNotElonError } from '../../utils/errors/elon-error';
import { CreateTransaction } from '../../utils/types/transactions/create-transaction';

export class CreateTransactionUseCase {
    constructor(private transactionRepository: TransactionRepository, private accountRepository: AccountRepository)  {}

    async execute(data: CreateTransaction) {
        const accountExists = await this.accountRepository.get(data.accountId);
        if (!accountExists) {
            throw new AccountNotFoundError();
        }

        if(accountExists.balance >= 10_000_000_000 && data.type === 'deposit') {
            throw new YouAreNotElonError();
        }

        const transaction = await this.transactionRepository.create(data).catch(() => {
            throw new CreateTransactionError();
        });

        return transaction;
    }
}