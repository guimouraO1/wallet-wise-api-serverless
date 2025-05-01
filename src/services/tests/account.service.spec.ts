import { beforeEach, it, describe, expect, afterEach } from 'vitest';
import { InMemoryAccountsRepository } from '../../repositories/in-memory/in-memory-account-repository';
import { AccountService } from '../account.service';
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository';
import { User } from '../../repositories/users-repository';
import { AccountAlreadyExistsError } from '../../utils/errors/account-already-exists-error';
import { AccountNotFoundError } from '../../utils/errors/account-not-found-error';
import { UserNotFoundError } from '../../utils/errors/user-not-found-error';
import { FAKE_USER } from '../../utils/constants/fake-user';

let accountRepository: InMemoryAccountsRepository;
let usersRepository: InMemoryUsersRepository;
let sut: AccountService;
let user: User;

describe('Account Service', () => {
    beforeEach(async () => {
        accountRepository = new InMemoryAccountsRepository();
        usersRepository = new InMemoryUsersRepository();
        sut = new AccountService(accountRepository, usersRepository);

        user = await usersRepository.create({ name: FAKE_USER.name, email: FAKE_USER.email, password: FAKE_USER.password });
    });

    afterEach(() => {
        accountRepository.items = [];
        usersRepository.items = [];
    });

    it('should be able to create account', async () => {
        const account = await sut.create(user.id);

        expect(account.id).toEqual(expect.any(String));
        expect(account.balance).toEqual(0.0);
        expect(account.userId).toEqual(user.id);
    });

    it('should not be able to create account if user do not exists', async () => {
        await expect(() => sut.create('user_do_not_exists')).rejects.toBeInstanceOf(UserNotFoundError);
    });

    it('should not be able to search account if account do not exists', async () => {
        await expect(() => sut.getAccountByUserId(user.id)).rejects.toBeInstanceOf(AccountNotFoundError);
    });

    it('should not be able to create account if account already exists', async () => {
        await sut.create(user.id);
        await expect(() => sut.create(user.id)).rejects.toBeInstanceOf(AccountAlreadyExistsError);
    });

    it('should be able to search account', async () => {
        await sut.create(user.id);
        const account = await sut.getAccountByUserId(user.id);

        expect(account).toEqual(expect.any(Object));
        expect(account?.id).toEqual(expect.any(String));
        expect(account?.balance).toEqual(0.0);
        expect(account?.userId).toEqual(user.id);
    });
});