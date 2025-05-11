import { beforeEach, it, describe, expect, afterEach } from 'vitest';
import { InMemoryAccountsRepository } from '../../../repositories/in-memory/in-memory-account-repository';
import { InMemoryTransactionRepository } from '../../../repositories/in-memory/in-memory-transaction-repository';
import { Account } from '../../../repositories/account-repository';
import { GetTransactionsSummaryUseCase } from '../../transactions/get-transactions-summary.use-case';
import { DateTime } from 'luxon';
import { AccountNotFoundError } from '../../../utils/errors/account-not-found-error';
import { fakerPT_BR } from '@faker-js/faker';
import { PaymentMethodEnum, TransactionCreateInput, TransactionTypeEnum } from '../../../repositories/transaction-repository';

let accountRepository: InMemoryAccountsRepository;
let transactionRepository: InMemoryTransactionRepository;
let sut: GetTransactionsSummaryUseCase;
let account: Account;
let transaction: TransactionCreateInput;

describe('Get Transactions Summary Use Case', () => {
    beforeEach(async () => {
        accountRepository = new InMemoryAccountsRepository();
        transactionRepository = new InMemoryTransactionRepository();
        sut = new GetTransactionsSummaryUseCase(transactionRepository, accountRepository);

        account = await accountRepository.create({ userId: fakerPT_BR.string.uuid() });
        transaction = {
            accountId: account.id,
            amount: fakerPT_BR.number.float({ min: 0.01, max: 10_000_000 }),
            name: fakerPT_BR.company.name(),
            paymentMethod: fakerPT_BR.helpers.enumValue(PaymentMethodEnum),
            type: TransactionTypeEnum.Deposit
        };
    });

    afterEach(() => {
        accountRepository.items = [];
        transactionRepository.items = [];
    });

    it('should be able to get transactions summary in a year', async () => {
        const ammouts = [fakerPT_BR.number.float({ min: 1, max: 1000 }), fakerPT_BR.number.float({ min: 1, max: 1000 })];

        await transactionRepository.create({ ...transaction, amount: ammouts[0] });
        await transactionRepository.create({ ...transaction, amount: ammouts[1] });

        const now = DateTime.now();
        const year = now.toFormat('yyyy');
        const monthIndex = now.month - 1;

        const transactions = await sut.execute({ accountId: account.id, year });
        const expectedMonthName = DateTime.fromObject({ month: monthIndex + 1 }).toFormat('LLLL');

        expect(transactions[monthIndex].name).toEqual(expectedMonthName);
        expect(transactions[monthIndex].value).toEqual(ammouts[0] + ammouts[1]);
    });

    it('should be able to get transactions summary filtered by type withdraw', async () => {
        const ammouts = [fakerPT_BR.number.float({ min: 1, max: 1000 }), fakerPT_BR.number.float({ min: 1, max: 1000 })];

        await transactionRepository.create({ ...transaction, amount: ammouts[0], type: TransactionTypeEnum.Withdraw });
        await transactionRepository.create({ ...transaction, amount: ammouts[1], type: TransactionTypeEnum.Withdraw });
        await transactionRepository.create({ ...transaction, type: TransactionTypeEnum.Deposit });

        const now = DateTime.now();
        const year = now.toFormat('yyyy');
        const monthIndex = now.month - 1;

        const transactions = await sut.execute({ accountId: account.id, year, type: TransactionTypeEnum.Withdraw });
        const expectedMonthName = DateTime.fromObject({ month: monthIndex + 1 }).toFormat('LLLL');

        expect(transactions[monthIndex].name).toEqual(expectedMonthName);
        expect(transactions[monthIndex].value).toEqual(ammouts[0] + ammouts[1]);
    });

    it('should be able to get transactions summary filtered by type deposit', async () => {
        const ammouts = [fakerPT_BR.number.float({ min: 1, max: 1000 }), fakerPT_BR.number.float({ min: 1, max: 1000 })];

        await transactionRepository.create({ ...transaction, amount: ammouts[0], type: TransactionTypeEnum.Deposit });
        await transactionRepository.create({ ...transaction, amount: ammouts[1], type: TransactionTypeEnum.Deposit });
        await transactionRepository.create({ ...transaction, type: TransactionTypeEnum.Withdraw });

        const now = DateTime.now();
        const year = now.toFormat('yyyy');
        const monthIndex = now.month - 1;

        const transactions = await sut.execute({ accountId: account.id, year, type: TransactionTypeEnum.Deposit });
        const expectedMonthName = DateTime.fromObject({ month: monthIndex + 1 }).toFormat('LLLL');

        expect(transactions[monthIndex].name).toEqual(expectedMonthName);
        expect(transactions[monthIndex].value).toEqual(ammouts[0] + ammouts[1]);
    });

    it('should not be able to find paginated transactions summary if account does not exist', async () => {
        await expect(sut.execute({ accountId: fakerPT_BR.string.uuid(), year: DateTime.now().toFormat('yyyy') }))
            .rejects.toBeInstanceOf(AccountNotFoundError);
    });
});