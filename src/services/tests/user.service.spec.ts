import { beforeEach, expect, it, describe, afterEach } from 'vitest';
import { hash } from 'bcryptjs';
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository';
import { PASSWORD_HASH_ROUNDS } from '../../utils/constants/password-hash-rounds.constant';
import { UserService } from '../user.service';
import { UserAlreadyExistsError } from '../../utils/errors/user-already-exists-error';
import { InMemoryAccountsRepository } from '../../repositories/in-memory/in-memory-account-repository';
import { fakeUser } from '../../utils/constants/fake-user';

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
        const user = await sut.create({ email: fakeUser.email, name: fakeUser.name, password: fakeUser.password });

        expect(user.id).toEqual(expect.any(String));
        expect(user.name).toEqual(fakeUser.name);
        expect(user.email).toEqual(fakeUser.email);
    });

    it('should not be able to create a user if email already registered', async () => {
        await usersRepository.create({
            name: fakeUser.name,
            email: fakeUser.email,
            password: await hash(fakeUser.password, PASSWORD_HASH_ROUNDS)
        });

        await expect(() => sut.create(fakeUser)).rejects.toBeInstanceOf(UserAlreadyExistsError);
    });

    it('should be able to get user by id', async () => {
        const createdUser = await sut.create(fakeUser);
        const user = await sut.getUserById(createdUser.id);

        expect(user?.id).toEqual(createdUser.id);
        expect(user?.email).toEqual(fakeUser.email);
        expect(user?.name).toEqual(fakeUser.name);
    });
});