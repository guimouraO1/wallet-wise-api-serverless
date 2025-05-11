import { beforeEach, expect, it, describe, afterEach } from 'vitest';
import { fakerPT_BR } from '@faker-js/faker';
import { InMemoryUsersRepository } from '../../../repositories/in-memory/in-memory-users-repository';
import { UserCreateInput } from '../../../repositories/users-repository';
import { UserAlreadyExistsError } from '../../../utils/errors/user-already-exists-error';
import { CreateUserUseCase } from '../../user/create-user.use-case';

let usersRepository: InMemoryUsersRepository;
let sut: CreateUserUseCase;
let user: UserCreateInput;

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