import { beforeEach, expect, it, describe, afterEach } from 'vitest';
import { InMemoryUsersRepository } from '../../../repositories/in-memory/in-memory-users-repository';
import { fakerPT_BR } from '@faker-js/faker';
import { InvalidCredentialsError } from '../../../utils/errors/invalid-credentials-error';
import { SignInUseCase } from '../../auth/sign-in.use-case';
import { UserNotFoundError } from '../../../utils/errors/user-not-found-error';
import { UserCreateInput } from '../../../repositories/users-repository';

let usersRepository: InMemoryUsersRepository;
let sut: SignInUseCase;
let user: UserCreateInput;

describe('Sign In Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new SignInUseCase(usersRepository);

        user = {
            email: fakerPT_BR.internet.email(),
            name: fakerPT_BR.person.fullName(),
            password: fakerPT_BR.internet.password(),
            avatarUrl: fakerPT_BR.image.avatarGitHub()
        };
    });

    afterEach(() => {
        usersRepository.items = [];
    });

    it('should be able to sign-in', async () => {
        const userCreated = await usersRepository.create(user);

        const userResponse = await sut.execute({ email: userCreated.email, password: user.password });

        expect(userResponse.id).toEqual(expect.any(String));
        expect(userResponse.email).toEqual(user.email);
        expect(userResponse.name).toEqual(user.name);
        expect(userResponse.avatarUrl).toEqual(user.avatarUrl);
    });

    it('should not be able to sign-in with not registred user', async () => {
        await expect(() => sut.execute({ email: fakerPT_BR.internet.email(), password: fakerPT_BR.internet.password() }))
            .rejects.toBeInstanceOf(UserNotFoundError);
    });

    it('should not be able to sign-in with wrong email', async () => {
        await usersRepository.create(user);
        await expect(() => sut.execute({
            email: fakerPT_BR.internet.email({ firstName: 'email_not_registred' }),
            password: user.password })).rejects.toBeInstanceOf(UserNotFoundError);
    });

    it('should not be able to sign-in with wrong password', async () => {
        await usersRepository.create(user);
        await expect(() => sut.execute({
            email: user.email,
            password: fakerPT_BR.internet.password() })).rejects.toBeInstanceOf(InvalidCredentialsError);
    });
});