import { fakerPT_BR } from '@faker-js/faker';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { InMemoryAccountsRepository } from '../../../repositories/in-memory/in-memory-account-repository';
import { InMemoryTransactionRepository } from '../../../repositories/in-memory/in-memory-transaction-repository';
import { GetTransactionsUseCase } from '../../../use-cases/transactions/get-transactions.use-case';
import { AccountNotFoundError } from '../../../utils/errors/account-not-found-error';
import { Account } from '../../../utils/types/account/account';
import { CreateTransaction } from '../../../utils/types/transactions/create-transaction';
import { PaymentMethodEnum, TransactionTypeEnum } from '../../../utils/types/transactions/transaction';

let accountRepository: InMemoryAccountsRepository;
let transactionRepository: InMemoryTransactionRepository;
let sut: GetTransactionsUseCase;
let account: Account;
let transaction: CreateTransaction;

describe('Get Transactions Use Case', () => {
    beforeEach(async () => {
        accountRepository = new InMemoryAccountsRepository();
        transactionRepository = new InMemoryTransactionRepository();
        sut = new GetTransactionsUseCase(transactionRepository, accountRepository);

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

    it('should be able to get paginated transactions', async () => {
        await transactionRepository.create({ ...transaction, amount: fakerPT_BR.number.float({ min: 1, max: 10_000 }), type: TransactionTypeEnum.Deposit });
        await transactionRepository.create({ ...transaction, amount: fakerPT_BR.number.float({ min: 1, max: 10_000 }) });

        const { transactions, transactionsCount } = await sut.execute({ accountId: account.id, offset: 1, page: 1 });

        expect(transactionsCount).toEqual(2);
        expect(transactions[0].name).toEqual(transaction.name);
        expect(transactions[0].type).toEqual(TransactionTypeEnum.Deposit);
    });

    it('should be able to get transactions filtered by type withdraw', async () => {
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

        const { transactions, transactionsCount } = await sut.execute({ accountId: account.id, offset: 2, page: 1, type: TransactionTypeEnum.Withdraw });

        expect(transactionsCount).toEqual(1);
        expect(transactions[0].amount).toEqual(transaction.amount);
        expect(transactions[0].description).toEqual(transaction.description);
        expect(transactions[0].name).toEqual(transaction.name);
    });

    it('should be able to get transactions filtered by type deposit', async () => {
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

        const { transactions, transactionsCount } = await sut.execute({ accountId: account.id, offset: 2, page: 1, type: TransactionTypeEnum.Deposit });

        expect(transactionsCount).toEqual(1);
        expect(transactions[0].amount).toEqual(transaction.amount);
        expect(transactions[0].description).toEqual(transaction.description);
        expect(transactions[0].name).toEqual(transaction.name);
    });

    it('should be able to get transactions filtered by payment method', async () => {
        await transactionRepository.create({
            ...transaction,
            paymentMethod: PaymentMethodEnum.CreditCard
        });

        await transactionRepository.create({
            accountId: account.id,
            name: fakerPT_BR.company.name(),
            paymentMethod: PaymentMethodEnum.DebitCard,
            description: fakerPT_BR.finance.transactionDescription(),
            amount: fakerPT_BR.number.float({ min: 1, max: 1000 }),
            type: fakerPT_BR.helpers.enumValue(TransactionTypeEnum)
        });

        const { transactions, transactionsCount } =
            await sut.execute({ accountId: account.id, offset: 2, page: 1, paymentMethod: PaymentMethodEnum.CreditCard });

        expect(transactionsCount).toEqual(1);
        expect(transactions[0].amount).toEqual(transaction.amount);
        expect(transactions[0].description).toEqual(transaction.description);
        expect(transactions[0].name).toEqual(transaction.name);
    });

    it('should be able to get transactions filtered by name', async () => {
        await transactionRepository.create({
            ...transaction,
            name: transaction.name
        });

        await transactionRepository.create({
            accountId: account.id,
            name: fakerPT_BR.company.name(),
            paymentMethod: PaymentMethodEnum.DebitCard,
            description: fakerPT_BR.finance.transactionDescription(),
            amount: fakerPT_BR.number.float({ min: 1, max: 1000 }),
            type: fakerPT_BR.helpers.enumValue(TransactionTypeEnum)
        });

        const { transactions, transactionsCount } =
            await sut.execute({ accountId: account.id, offset: 2, page: 1, name: transaction.name });

        expect(transactionsCount).toEqual(1);
        expect(transactions[0].amount).toEqual(transaction.amount);
        expect(transactions[0].description).toEqual(transaction.description);
        expect(transactions[0].name).toEqual(transaction.name);
    });

    it('should not be able to get transactions if account do not exists', async () => {
        await expect(sut.execute({ accountId: fakerPT_BR.string.uuid(), offset: 2, page: 1 })).rejects.toBeInstanceOf(AccountNotFoundError);
    });
});