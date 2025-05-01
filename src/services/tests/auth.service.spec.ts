import { beforeEach, expect, it, describe, afterEach } from 'vitest';
import { hash } from 'bcryptjs';
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository';
import { PASSWORD_HASH_ROUNDS } from '../../utils/constants/password-hash-rounds';
import { InvalidCredentialsError } from '../../utils/errors/invalid-credentials-error';
import { AuthService } from '../auth.service';
import { FAKE_USER } from '../../utils/constants/fake-user';

let usersRepository: InMemoryUsersRepository;
let sut: AuthService;

describe('Authenticate Service', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new AuthService(usersRepository);
    });

    afterEach(() => {
        usersRepository.items = [];
    });

    it('should be able to authenticate', async () => {
        await usersRepository.create({ name: FAKE_USER.name, email: FAKE_USER.email, password: await hash(FAKE_USER.password, PASSWORD_HASH_ROUNDS) });
        const user = await sut.signIn({ email: FAKE_USER.email, password: FAKE_USER.password });

        expect(user.id).toEqual(expect.any(String));
    });

    it('should not be able to authenticate with a non-registered user', async () => {
        await expect(() => sut.signIn({ email: 'user_do_not_exists', password: 'any_password' })).rejects.toBeInstanceOf(InvalidCredentialsError);
    });

    it('should not be able to authenticate with wrong email', async () => {
        await usersRepository.create({ name: FAKE_USER.name, email: FAKE_USER.email, password: await hash(FAKE_USER.password, PASSWORD_HASH_ROUNDS) });
        await expect(() => sut.signIn({ email: 'wrong_email', password: FAKE_USER.password })).rejects.toBeInstanceOf(InvalidCredentialsError);
    });

    it('should not be able to authenticate with wrong password', async () => {
        await usersRepository.create({ name: FAKE_USER.name, email: FAKE_USER.email, password: await hash(FAKE_USER.password, PASSWORD_HASH_ROUNDS) });
        await expect(() => sut.signIn({ email: FAKE_USER.email, password: 'wrong_password' })).rejects.toBeInstanceOf(InvalidCredentialsError);
    });
});