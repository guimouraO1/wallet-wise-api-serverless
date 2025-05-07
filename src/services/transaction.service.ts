
import { YouAreNotElonError } from '../utils/errors/elon-error';
import { AccountRepository } from '../repositories/account-repository';
import { Transaction, TransactionCreateInput, TransactionRepository, TransactionsAndCount } from '../repositories/transaction-repository';
import { AccountNotFoundError } from '../utils/errors/account-not-found-error';
import { UpdateAccountError } from '../utils/errors/update-account-error';
import { GetPaginatedTransactionsInternalType } from '../utils/schemas/internal/transactions/get-paginated-transactions.schema';
import { GetTransactionsInPeriodInternalType } from '../utils/schemas/internal/transactions/get-transactions-in-period.schema';

export class TransactionService {
    constructor(private transactionRepository: TransactionRepository, private accountRepository: AccountRepository)  {}

    async create(data: TransactionCreateInput): Promise<Transaction> {
        const accountExists = await this.accountRepository.getByAccountId(data.accountId);
        if (!accountExists) {
            throw new AccountNotFoundError();
        }

        if(accountExists.balance >= 10_000_000_000 && data.type === 'deposit') {
            throw new YouAreNotElonError();
        }

        await this.accountRepository.update({ accountId: data.accountId, amount: data.amount, type: data.type }).catch(() => {
            throw new UpdateAccountError();
        });

        const transaction = await this.transactionRepository.create(data);

        return transaction;
    }

    async getByAccountId(data: GetPaginatedTransactionsInternalType): Promise<TransactionsAndCount> {
        const accountExists = await this.accountRepository.getByAccountId(data.accountId);
        if (!accountExists) {
            throw new AccountNotFoundError();
        }

        const transactions = await this.transactionRepository.getByAccountId(data);
        return transactions;
    }

    async getByAccountIdInPeriod({ accountId, startDate, endDate, type }: GetTransactionsInPeriodInternalType): Promise<TransactionsAndCount> {
        const accountExists = await this.accountRepository.getByAccountId(accountId);
        if (!accountExists) {
            throw new AccountNotFoundError();
        }

        const transactions = await this.transactionRepository.getByAccountIdInPeriod({ accountId, startDate, endDate, type });
        return transactions;
    }

    async delete(transactionId: string) {
        const transaction = await this.transactionRepository.delete(transactionId);
        return transaction;
    }
}