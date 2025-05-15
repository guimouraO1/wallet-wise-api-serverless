import { fakerPT_BR } from '@faker-js/faker';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { InMemoryUsersRepository } from '../../../repositories/in-memory/in-memory-users-repository';
import { GetUserByIdUseCase } from '../../../use-cases/user/get-user-by-id.use-case';
import { UserNotFoundError } from '../../../utils/errors/user-not-found-error';
import { CreateUser } from '../../../utils/types/user/create-user';

let usersRepository: InMemoryUsersRepository;
let sut: GetUserByIdUseCase;
let user: CreateUser;

describe('Get User By Id Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new GetUserByIdUseCase(usersRepository);

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

    it('should be able to get user by id', async () => {
        const createdUser = await usersRepository.create(user);
        const userResponse = await sut.execute(createdUser.id);

        expect(userResponse.id).toEqual(createdUser.id);
        expect(userResponse.name).toEqual(user.name);
        expect(userResponse.email).toEqual(user.email);
        expect(userResponse.avatarUrl).toEqual(user.avatarUrl);
    });

    it('should not be able to get user by id if user is not registered', async () => {
        await expect(() => sut.execute(fakerPT_BR.string.uuid())).rejects.toBeInstanceOf(UserNotFoundError);
    });
});