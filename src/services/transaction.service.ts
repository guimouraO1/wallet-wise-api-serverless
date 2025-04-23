
import { AccountRepository } from '../repositories/account-repository';
import { Transaction, TransactionCreateInput, TransactionRepository, TransactionsAndCount } from '../repositories/transaction-repository';
import { AccountNotFoundError } from '../utils/errors/account-not-found-error';
import { UpdateAccountError } from '../utils/errors/update-account-error';
import { FindManyTransactionsSchemaType } from '../utils/schemas/transactions/find-many-transactions-schema';
import { DateTime } from 'luxon';

export class TransactionService {
    constructor(private transactionRepository: TransactionRepository, private accountRepository: AccountRepository)  {}

    async create(data: TransactionCreateInput): Promise<Transaction> {
        const accountExists = await this.accountRepository.findByAccountId(data.accountId);
        if (!accountExists) {
            throw new AccountNotFoundError();
        }

        await this.accountRepository.updateAccount({ accountId: data.accountId, amount: data.amount, type: data.type }).catch(() => {
            throw new UpdateAccountError();
        });

        const transaction = await this.transactionRepository.create(data);

        return transaction;
    }

    async findManyByAccountId(data: FindManyTransactionsSchemaType): Promise<TransactionsAndCount> {
        const accountExists = await this.accountRepository.findByAccountId(data.accountId);
        if (!accountExists) {
            throw new AccountNotFoundError();
        }

        const transactions = await this.transactionRepository.findManyByAccountId(data);
        return transactions;
    }

    async findManyInPeriodByAccountId(accountId: string, startDate: string, endDate: string): Promise<TransactionsAndCount> {
        const accountExists = await this.accountRepository.findByAccountId(accountId);
        if (!accountExists) {
            throw new AccountNotFoundError();
        }

        const TIMEZONE = 'America/Sao_Paulo';

        const startDateFormated = DateTime.fromFormat(startDate, 'dd-MM-yyyy', { zone: TIMEZONE }).endOf('day').toJSDate();
        const endDateFormated = DateTime.fromFormat(endDate, 'dd-MM-yyyy', { zone: TIMEZONE }).endOf('day').toJSDate();

        const transactions = await this.transactionRepository.findManyInPeriodByAccountId(accountId, startDateFormated, endDateFormated);
        return transactions;
    }

    async delete(transactionId: string) {
        const transaction = await this.transactionRepository.delete(transactionId);
        return transaction;
    }
}