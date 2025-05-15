import { fakerPT_BR } from '@faker-js/faker';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { InMemoryAccountsRepository } from '../../../repositories/in-memory/in-memory-account-repository';
import { InMemoryUsersRepository } from '../../../repositories/in-memory/in-memory-users-repository';
import { GetAccountByUserIdUseCase } from '../../../use-cases/account/get-account-by-user-id.use-case';
import { AccountNotFoundError } from '../../../utils/errors/account-not-found-error';
import { UserNotFoundError } from '../../../utils/errors/user-not-found-error';
import { CreateUser } from '../../../utils/types/user/create-user';

let accountRepository: InMemoryAccountsRepository;
let usersRepository: InMemoryUsersRepository;
let sut: GetAccountByUserIdUseCase;
let user: CreateUser;

describe('Get Account By User Id Use Case', () => {
    beforeEach(async () => {
        accountRepository = new InMemoryAccountsRepository();
        usersRepository = new InMemoryUsersRepository();
        sut = new GetAccountByUserIdUseCase(accountRepository, usersRepository);

        user = {
            email: fakerPT_BR.internet.email(),
            name: fakerPT_BR.person.fullName(),
            password: fakerPT_BR.internet.password(),
            avatarUrl: fakerPT_BR.image.avatarGitHub()
        };
    });

    afterEach(() => {
        accountRepository.items = [];
        usersRepository.items = [];
    });

    it('should not be able to get account if user do not exists', async () => {
        await expect(() => sut.execute(fakerPT_BR.string.uuid())).rejects.toBeInstanceOf(UserNotFoundError);
    });

    it('should not be able to get account if account do not exists', async () => {
        const userCreated = await usersRepository.create(user);

        accountRepository.items = [];

        await expect(() => sut.execute(userCreated.id)).rejects.toBeInstanceOf(AccountNotFoundError);
    });

    it('should be able to get account by user id', async () => {
        const userCreated = await usersRepository.create(user);

        await accountRepository.create(userCreated.id);
        const account = await sut.execute(userCreated.id);

        expect(account.id).toEqual(expect.any(String));
        expect(account.balance).toEqual(0.0);
        expect(account.userId).toEqual(userCreated.id);
    });
});