import { beforeEach, it, describe, expect, afterEach } from 'vitest';
import { InMemoryAccountsRepository } from '../../repositories/in-memory/in-memory-account-repository';
import { InMemoryTransactionRepository } from '../../repositories/in-memory/in-memory-transaction-repository';
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository';
import { AccountNotFoundError } from '../../utils/errors/account-not-found-error';
import { TransactionService } from '../transaction.service';
import { Account } from '../../repositories/account-repository';
import { User } from '../../repositories/users-repository';
import { fakeUser } from '../../utils/constants/fake-user';

let usersRepository: InMemoryUsersRepository;
let accountRepository: InMemoryAccountsRepository;
let transactionRepository: InMemoryTransactionRepository;
let sut: TransactionService;
let account: Account;
let user: User;

describe('Transaction Service', () => {
    beforeEach(async () => {
        usersRepository = new InMemoryUsersRepository();
        accountRepository = new InMemoryAccountsRepository();
        transactionRepository = new InMemoryTransactionRepository();
        sut = new TransactionService(transactionRepository, accountRepository);

        user = await usersRepository.create({ name: fakeUser.name, email: fakeUser.email, password: fakeUser.password });
        account = await accountRepository.create({ userId: user.id });
    });

    afterEach(() => {
        accountRepository.items = [];
        transactionRepository.items = [];
        transactionRepository.items = [];
    });

    it('should be able to make transaction deposit money in account', async () => {
        const oldBalanceValue = account.balance;
        const transaction = await sut.create({ accountId: account.id, amount: 10, name: 'Monthly payment', paymentMethod: 'pix', type: 'deposit' });

        expect(transaction.id).toEqual(expect.any(String));
        expect(transaction.accountId).toEqual(account.id);
        expect(transaction.amount).toEqual(10);
        expect(transaction.type).toEqual('deposit');
        expect(transaction.paymentMethod).toEqual('pix');

        const accountAfterTransaction = await accountRepository.findByAccountId(transaction.accountId);
        expect(accountAfterTransaction?.balance).toEqual(oldBalanceValue + 10);
        expect(accountAfterTransaction?.balance).toEqual(account.balance);
    });

    it('should be able to make transaction withdraw money account', async () => {
        const oldBalanceValue = account.balance;
        const transaction = await sut.create({ accountId: account.id, amount: 200.23, name: 'Paying bill', paymentMethod: 'credit_card', type: 'withdraw' });

        expect(transaction.id).toEqual(expect.any(String));
        expect(transaction.accountId).toEqual(account.id);
        expect(transaction.amount).toEqual(200.23);
        expect(transaction.type).toEqual('withdraw');
        expect(transaction.paymentMethod).toEqual('credit_card');

        const accountAfterTransaction = await accountRepository.findByAccountId(transaction.accountId);
        expect(accountAfterTransaction?.balance).toEqual(oldBalanceValue - 200.23);
    });

    it('should not be able to create an transaction if account do not exists', async () => {
        accountRepository.items = [];
        await expect(() => sut.create({ accountId: '123', amount: 200, name: 'Paying bill xxx', paymentMethod: 'credit_card', type: 'withdraw' }))
            .rejects.toBeInstanceOf(AccountNotFoundError);
    });

    it('should be able to find many transactions paginated', async () => {
        await sut.create({ accountId: account.id, amount: 25, name: 'Subscription fee', paymentMethod: 'credit_card', type: 'deposit' });
        await sut.create({ accountId: account.id, amount: 30, name: 'Bonus deposit', paymentMethod: 'account_cash', type: 'deposit' });
        await sut.create({ accountId: account.id, amount: 125, name: 'Service charge', paymentMethod: 'debit_card', type: 'withdraw' });
        await sut.create({ accountId: account.id, amount: 200, name: 'Bill payment', paymentMethod: 'pix', type: 'withdraw' });
        await sut.create({ accountId: account.id, amount: 50, name: 'Cashback reward', paymentMethod: 'pix', type: 'deposit' });
        await sut.create({ accountId: account.id, amount: 20, name: 'Bill cashback', paymentMethod: 'pix', type: 'deposit' });

        const { transactions, transactionsCount } = await transactionRepository.findManyByAccountId({ accountId: account.id, page: 2, offset: 5 });
        expect(transactions.length).toEqual(1);
        expect(transactions[0].accountId).toEqual(account.id);
        expect(transactions[0].amount).toEqual(20);
        expect(transactions[0].paymentMethod).toEqual('pix');
        expect(transactions[0].type).toEqual('deposit');
        expect(transactionsCount).toEqual(6);
    });

    it('should not be able to find paginated transactions if account do not exists', async () => {
        accountRepository.items = [];
        await expect(() => sut.findManyByAccountId({ accountId: account.id, page: 2, offset: 5 })).rejects.toBeInstanceOf(AccountNotFoundError);
    });
});