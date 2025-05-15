import { fakerPT_BR } from '@faker-js/faker';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { InMemoryUsersRepository } from '../../../repositories/in-memory/in-memory-users-repository';
import { CreateUserUseCase } from '../../../use-cases/user/create-user.use-case';
import { UserAlreadyExistsError } from '../../../utils/errors/user-already-exists-error';
import { CreateUser } from '../../../utils/types/user/create-user';

let usersRepository: InMemoryUsersRepository;
let sut: CreateUserUseCase;
let user: CreateUser;

describe('Create User Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new CreateUserUseCase(usersRepository);

        user = {
            name: fakerPT_BR.person.fullName(),
            email: fakerPT_BR.internet.email(),
            password: fakerPT_BR.internet.password(),
            avatarUrl: fakerPT_BR.image.avatarGitHub()
        };
    });

    afterEach(() => {
        usersRepository.items = [];
    });

    it('should be able to create new user', async () => {
        const userCreated = await usersRepository.create(user);

        expect(userCreated.id).toEqual(expect.any(String));
        expect(userCreated.name).toEqual(user.name);
        expect(userCreated.email).toEqual(user.email);
        expect(userCreated.avatarUrl).toEqual(user.avatarUrl);
    });

    it('should not be able to create user if email already registered', async () => {
        await usersRepository.create(user);
        await expect(() => sut.execute(user)).rejects.toBeInstanceOf(UserAlreadyExistsError);
    });
});