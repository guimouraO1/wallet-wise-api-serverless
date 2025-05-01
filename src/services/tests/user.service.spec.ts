import { beforeEach, expect, it, describe, afterEach } from 'vitest';
import { hash } from 'bcryptjs';
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository';
import { PASSWORD_HASH_ROUNDS } from '../../utils/constants/password-hash-rounds';
import { UserService } from '../user.service';
import { UserAlreadyExistsError } from '../../utils/errors/user-already-exists-error';
import { InMemoryAccountsRepository } from '../../repositories/in-memory/in-memory-account-repository';
import { FAKE_USER } from '../../utils/constants/fake-user';

let usersRepository: InMemoryUsersRepository;
let accountRepository: InMemoryAccountsRepository;

let sut: UserService;

describe('User Service', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        accountRepository = new InMemoryAccountsRepository();
        sut = new UserService(usersRepository, accountRepository);
    });

    afterEach(() => {
        usersRepository.items = [];
    });

    it('should be able to create new user', async () => {
        const user = await sut.create({ email: FAKE_USER.email, name: FAKE_USER.name, password: FAKE_USER.password });

        expect(user.id).toEqual(expect.any(String));
        expect(user.name).toEqual(FAKE_USER.name);
        expect(user.email).toEqual(FAKE_USER.email);
    });

    it('should not be able to create a user if email already registered', async () => {
        await usersRepository.create({
            name: FAKE_USER.name,
            email: FAKE_USER.email,
            password: await hash(FAKE_USER.password, PASSWORD_HASH_ROUNDS)
        });

        await expect(() => sut.create(FAKE_USER)).rejects.toBeInstanceOf(UserAlreadyExistsError);
    });

    it('should be able to get user by id', async () => {
        const createdUser = await sut.create(FAKE_USER);
        const user = await sut.getUserById(createdUser.id);

        expect(user?.id).toEqual(createdUser.id);
        expect(user?.email).toEqual(FAKE_USER.email);
        expect(user?.name).toEqual(FAKE_USER.name);
    });
});