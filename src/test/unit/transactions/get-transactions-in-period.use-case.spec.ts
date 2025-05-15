import { fakerPT_BR } from '@faker-js/faker';
import { DateTime } from 'luxon';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { InMemoryAccountsRepository } from '../../../repositories/in-memory/in-memory-account-repository';
import { InMemoryTransactionRepository } from '../../../repositories/in-memory/in-memory-transaction-repository';
import { GetTransactionsInPeriodUseCase } from '../../../use-cases/transactions/get-transactions-in-period.use-case';
import { AccountNotFoundError } from '../../../utils/errors/account-not-found-error';
import { Account } from '../../../utils/types/account/account';
import { CreateTransaction } from '../../../utils/types/transactions/create-transaction';
import { PaymentMethodEnum, TransactionTypeEnum } from '../../../utils/types/transactions/transaction';

let accountRepository: InMemoryAccountsRepository;
let transactionRepository: InMemoryTransactionRepository;
let sut: GetTransactionsInPeriodUseCase;
let account: Account;
let transaction: CreateTransaction;

describe('Get Transactions In Period Use Case', () => {
    beforeEach(async () => {
        accountRepository = new InMemoryAccountsRepository();
        transactionRepository = new InMemoryTransactionRepository();
        sut = new GetTransactionsInPeriodUseCase(transactionRepository, accountRepository);

        account = await accountRepository.create(fakerPT_BR.string.uuid());
        transaction = {
            accountId: account.id,
            amount: fakerPT_BR.number.float({ min: 0.01, max: 10_000_000 }),
            description: fakerPT_BR.finance.transactionDescription(),
            name: fakerPT_BR.company.name(),
            paymentMethod: fakerPT_BR.helpers.enumValue(PaymentMethodEnum),
            type: fakerPT_BR.helpers.enumValue(TransactionTypeEnum)
        };
    });

    afterEach(() => {
        accountRepository.items = [];
        transactionRepository.items = [];
    });

    it('should be able to get paginated transactions in period', async () => {
        await transactionRepository.create({ ...transaction, amount: fakerPT_BR.number.float({ min: 1, max: 10_000 }), type: TransactionTypeEnum.Deposit });
        await transactionRepository.create({ ...transaction, amount: fakerPT_BR.number.float({ min: 1, max: 10_000 }) });

        const { transactions, transactionsCount } = await sut.execute({
            accountId: account.id,
            startDate: DateTime.now().minus({ days: 31 }).toFormat('dd-MM-yyyy'),
            endDate:  DateTime.now().toFormat('dd-MM-yyyy')
        });

        expect(transactionsCount).toEqual(2);
        expect(transactions[0].name).toEqual(transaction.name);
        expect(transactions[0].type).toEqual(TransactionTypeEnum.Deposit);
    });

    it('should be able to get transactions in period filtered by type withdraw', async () => {
        await transactionRepository.create({
            ...transaction,
            type: TransactionTypeEnum.Withdraw
        });

        await transactionRepository.create({
            accountId: account.id,
            name: fakerPT_BR.company.name(),
            paymentMethod: fakerPT_BR.helpers.enumValue(PaymentMethodEnum),
            description: fakerPT_BR.finance.transactionDescription(),
            amount: fakerPT_BR.number.float({ min: 1, max: 1000 }),
            type: TransactionTypeEnum.Deposit
        });

        const { transactions, transactionsCount } = await sut.execute({
            accountId: account.id,
            startDate: DateTime.now().minus({ days: 31 }).toFormat('dd-MM-yyyy'),
            endDate:  DateTime.now().toFormat('dd-MM-yyyy'),
            type: TransactionTypeEnum.Withdraw
        });

        expect(transactionsCount).toEqual(1);
        expect(transactions[0].amount).toEqual(transaction.amount);
        expect(transactions[0].description).toEqual(transaction.description);
        expect(transactions[0].name).toEqual(transaction.name);
    });

    it('should be able to get transactions in period filtered by type deposit', async () => {
        await transactionRepository.create({
            ...transaction,
            type: TransactionTypeEnum.Deposit
        });

        await transactionRepository.create({
            accountId: account.id,
            name: fakerPT_BR.company.name(),
            paymentMethod: fakerPT_BR.helpers.enumValue(PaymentMethodEnum),
            description: fakerPT_BR.finance.transactionDescription(),
            amount: fakerPT_BR.number.float({ min: 1, max: 1000 }),
            type: TransactionTypeEnum.Withdraw
        });

        const { transactions, transactionsCount } = await sut.execute({
            accountId: account.id,
            startDate: DateTime.now().minus({ days: 31 }).toFormat('dd-MM-yyyy'),
            endDate:  DateTime.now().toFormat('dd-MM-yyyy'),
            type: TransactionTypeEnum.Deposit
        });

        expect(transactionsCount).toEqual(1);
        expect(transactions[0].amount).toEqual(transaction.amount);
        expect(transactions[0].description).toEqual(transaction.description);
        expect(transactions[0].name).toEqual(transaction.name);
    });

    it('should not be able to get transactions in period if account do not exists', async () => {
        await expect(sut.execute({
            accountId: fakerPT_BR.string.uuid(),
            startDate: DateTime.now().minus({ days: 31 }).toFormat('dd-MM-yyyy'),
            endDate:  DateTime.now().toFormat('dd-MM-yyyy')
        })).rejects.toBeInstanceOf(AccountNotFoundError);
    });
});