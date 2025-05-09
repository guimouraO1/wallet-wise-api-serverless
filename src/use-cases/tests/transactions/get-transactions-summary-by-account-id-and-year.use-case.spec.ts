import { beforeEach, it, describe, expect, afterEach } from 'vitest';
import { InMemoryAccountsRepository } from '../../../repositories/in-memory/in-memory-account-repository';
import { InMemoryTransactionRepository } from '../../../repositories/in-memory/in-memory-transaction-repository';
import { InMemoryUsersRepository } from '../../../repositories/in-memory/in-memory-users-repository';
import { User } from '../../../repositories/users-repository';
import { FAKE_USER } from '../../../utils/constants/fake-user';
import { Account } from '../../../repositories/account-repository';
import { GetTransactionsSummaryByAccountIdAndYearUseCase } from '../../transactions/get-transactions-summary-by-account-id-and-year.use-case';
import { DateTime } from 'luxon';
import { AccountNotFoundError } from '../../../utils/errors/account-not-found-error';

let usersRepository: InMemoryUsersRepository;
let accountRepository: InMemoryAccountsRepository;
let transactionRepository: InMemoryTransactionRepository;
let sut: GetTransactionsSummaryByAccountIdAndYearUseCase;
let account: Account;
let user: User;

describe('Transaction Service', () => {
    beforeEach(async () => {
        usersRepository = new InMemoryUsersRepository();
        accountRepository = new InMemoryAccountsRepository();
        transactionRepository = new InMemoryTransactionRepository();
        sut = new GetTransactionsSummaryByAccountIdAndYearUseCase(transactionRepository, accountRepository);

        user = await usersRepository.create({ name: FAKE_USER.name, email: FAKE_USER.email, password: FAKE_USER.password });
        account = await accountRepository.create({ userId: user.id });
    });

    afterEach(() => {
        accountRepository.items = [];
        transactionRepository.items = [];
        transactionRepository.items = [];
    });

    it('should be able to get transactions summary in a year', async () => {
        await transactionRepository.create({ accountId: account.id, amount: 10, name: 'Monthly payment', paymentMethod: 'pix', type: 'deposit' });
        await transactionRepository.create({ accountId: account.id, amount: 102, name: 'Monthly payment 2', paymentMethod: 'account_cash', type: 'withdraw' });

        const year = DateTime.now().toFormat('yyyy');
        const currentMonthIndex = DateTime.now().month - 1;

        const transactions = await sut.execute({ accountId: account.id, year });
        const expectedMonthName = DateTime.fromObject({ month: currentMonthIndex + 1 }).toFormat('LLLL');

        expect(transactions[currentMonthIndex].name).toEqual(expectedMonthName);
        expect(transactions[currentMonthIndex].value).toEqual(102 + 10);
    });

    it('should be able to get transactions summary in a year filtered by type withdraw', async () => {
        await transactionRepository.create({ accountId: account.id, amount: 100, name: 'Monthly payment', paymentMethod: 'pix', type: 'deposit' });
        await transactionRepository.create({ accountId: account.id, amount: 120, name: 'Monthly payment 2', paymentMethod: 'account_cash', type: 'withdraw' });
        await transactionRepository.create({ accountId: account.id, amount: 30, name: 'Monthly payment 2', paymentMethod: 'account_cash', type: 'withdraw' });

        const year = DateTime.now().toFormat('yyyy');
        const currentMonthIndex = DateTime.now().month - 1;

        const transactions = await sut.execute({ accountId: account.id, year, type: 'withdraw' });
        const expectedMonthName = DateTime.fromObject({ month: currentMonthIndex + 1 }).toFormat('LLLL');

        expect(transactions[currentMonthIndex].name).toEqual(expectedMonthName);
        expect(transactions[currentMonthIndex].value).toEqual(120 + 30);
    });

    it('should be able to get transactions summary in a year filtered by type deposit', async () => {
        await transactionRepository.create({ accountId: account.id, amount: 76, name: 'Monthly payment', paymentMethod: 'pix', type: 'deposit' });
        await transactionRepository.create({ accountId: account.id, amount: 120, name: 'Monthly payment 2', paymentMethod: 'account_cash', type: 'withdraw' });
        await transactionRepository.create({ accountId: account.id, amount: 30, name: 'Monthly payment 2', paymentMethod: 'account_cash', type: 'withdraw' });

        const year = DateTime.now().toFormat('yyyy');
        const currentMonthIndex = DateTime.now().month - 1;

        const transactions = await sut.execute({ accountId: account.id, year, type: 'deposit' });
        const expectedMonthName = DateTime.fromObject({ month: currentMonthIndex + 1 }).toFormat('LLLL');

        expect(transactions[currentMonthIndex].name).toEqual(expectedMonthName);
        expect(transactions[currentMonthIndex].value).toEqual(76);
    });

    it('should not be able to find paginated transactions if account does not exist', async () => {
        await expect(sut.execute({ accountId: 'invalid_id', year: DateTime.now().toFormat('yyyy') }))
            .rejects.toBeInstanceOf(AccountNotFoundError);
    });
});