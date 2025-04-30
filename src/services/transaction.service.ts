
import { YouAreNotElonCap } from 'src/utils/errors/elon-error';
import { AccountRepository } from '../repositories/account-repository';
import { Transaction, TransactionCreateInput, TransactionRepository, TransactionsAndCount } from '../repositories/transaction-repository';
import { AccountNotFoundError } from '../utils/errors/account-not-found-error';
import { UpdateAccountError } from '../utils/errors/update-account-error';
import { DateTime } from 'luxon';
import { GetPaginatedTransactionsInternalType } from 'src/utils/schemas/internal/transactions/get-paginated-transactions.schema';
import { TIMEZONE } from 'src/utils/constants/timezone';

export class TransactionService {
    constructor(private transactionRepository: TransactionRepository, private accountRepository: AccountRepository)  {}

    async create(data: TransactionCreateInput): Promise<Transaction> {
        const accountExists = await this.accountRepository.getByAccountId(data.accountId);
        if (!accountExists) {
            throw new AccountNotFoundError();
        }

        if(accountExists.balance >= 10_000_000_000) {
            throw new YouAreNotElonCap();
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

    async getByAccountIdInPeriod(accountId: string, startDate: string, endDate: string): Promise<TransactionsAndCount> {
        const accountExists = await this.accountRepository.getByAccountId(accountId);
        if (!accountExists) {
            throw new AccountNotFoundError();
        }

        const startDateFormated = DateTime.fromFormat(startDate, 'dd-MM-yyyy', { zone: TIMEZONE }).endOf('day').toJSDate();
        const endDateFormated = DateTime.fromFormat(endDate, 'dd-MM-yyyy', { zone: TIMEZONE }).endOf('day').toJSDate();

        const transactions = await this.transactionRepository.getByAccountIdInPeriod(accountId, startDateFormated, endDateFormated);
        return transactions;
    }

    async delete(transactionId: string) {
        const transaction = await this.transactionRepository.delete(transactionId);
        return transaction;
    }
}