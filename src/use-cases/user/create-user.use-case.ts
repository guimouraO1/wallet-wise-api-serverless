import { genSalt, hash } from 'bcryptjs';
import { UsersRepository } from '../../repositories/users-repository';
import { UserAlreadyExistsError } from '../../utils/errors/user-already-exists-error';
import { CreateUserBodyType } from '../../utils/schemas/request/user/create-user.schema';
import { env } from '../../utils/libs/env';
import { CreateUserError } from '../../utils/errors/create-user-error';

export class CreateUserUseCase {
    constructor(private usersRepository: UsersRepository) { }

    async execute({ email, name, password, avatarUrl }: CreateUserBodyType) {
        const userAlreadyExists = await this.usersRepository.getByEmail(email);
        if (userAlreadyExists) {
            throw new UserAlreadyExistsError();
        }

        const salt = await genSalt(env.PASSWORD_HASH_ROUNDS);
        const password_hash = await hash(password, salt);

        const user = await this.usersRepository.create({ name, email, password: password_hash, ...(avatarUrl ? { avatarUrl } : {}) })
            .catch(() => { throw new CreateUserError(); });

        return user;
    }
}