import { InMemoryAccountsRepository } from '../../repositories/in-memory/in-memory-account-repository';
import { InMemoryBillRepository } from '../../repositories/in-memory/in-memory-bill-repository';
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository';
import { AccountNotFoundError } from '../../utils/errors/account-not-found-error';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { BillService } from '../bill.service';
import { InMemoryTransactionRepository } from '../../repositories/in-memory/in-memory-transaction-repository';
import { Account } from '../../repositories/account-repository';
import { User } from '../../repositories/users-repository';
import { fakerPT_BR } from '@faker-js/faker';

let usersRepository: InMemoryUsersRepository;
let accountRepository: InMemoryAccountsRepository;
let billRepository: InMemoryBillRepository;
let transactionRepository: InMemoryTransactionRepository;
let sut: BillService;
let account: Account;
let user: User;

describe('Bill Service Tests', () => {
    beforeEach(async () => {
        billRepository = new InMemoryBillRepository();
        accountRepository = new InMemoryAccountsRepository();
        usersRepository = new InMemoryUsersRepository();
        transactionRepository = new InMemoryTransactionRepository();
        sut = new BillService(billRepository, accountRepository, transactionRepository);

        user = await usersRepository.create({
            name: fakerPT_BR.person.fullName(),
            email: fakerPT_BR.internet.email(),
            password: fakerPT_BR.internet.password()
        });
        account = await accountRepository.create({ userId: user.id });
    });

    afterEach(() => {
        usersRepository.items = [];
        accountRepository.items = [];
        billRepository.items = [];
    });

    it('should be able to create new bill', async () => {
        const bill = await sut.create({
            accountId: account.id,
            amount: 2000,
            name: 'New PC',
            dueDay: 15,
            installments: 10,
            paidInstallments: 0,
            billType: 'installment',
            frequency: 'monthly',
            active: true
        });

        expect(bill.id).toEqual(expect.any(String));
        expect(bill.accountId).toEqual(account.id);
        expect(bill.amount).toEqual(2000);
        expect(bill.name).toEqual('New PC');
        expect(bill.dueDay).toEqual(15);
        expect(bill.installments).toEqual(10);
        expect(bill.paidInstallments).toEqual(0);
        expect(bill.active).toEqual(true);
    });

    it('should not be able to create bill if account do not exists', async () => {
        accountRepository.items = [];

        await expect(() => sut.create({
            accountId: account.id,
            amount: 2000,
            name: 'New PC',
            dueDay: 15,
            installments: 10,
            paidInstallments: 0,
            billType: 'installment',
            frequency: 'monthly',
            active: false
        })).rejects.toBeInstanceOf(AccountNotFoundError);
    });

    it('should not be able to find many paginated bills if account do not exists', async () => {
        accountRepository.items = [];

        await expect(() => sut.getByAccountId({
            accountId: account.id,
            page: 1,
            offset: 5
        })).rejects.toBeInstanceOf(AccountNotFoundError);
    });
});