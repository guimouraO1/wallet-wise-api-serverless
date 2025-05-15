import { genSalt, hash } from 'bcryptjs';
import { UsersRepository } from '../../repositories/users-repository';
import { CreateUserError } from '../../utils/errors/create-user-error';
import { UserAlreadyExistsError } from '../../utils/errors/user-already-exists-error';
import { env } from '../../utils/libs/env';
import { CreateUser } from '../../utils/types/user/create-user';

export class CreateUserUseCase {
    constructor(private usersRepository: UsersRepository) { }

    async execute(data: CreateUser) {
        const userAlreadyExists = await this.usersRepository.getByEmail(data.email);
        if (userAlreadyExists) {
            throw new UserAlreadyExistsError();
        }

        const salt = await genSalt(env.PASSWORD_HASH_ROUNDS);
        const password_hash = await hash(data.password, salt);

        const user = await this.usersRepository.create({ ...data, password: password_hash })
            .catch(() => { throw new CreateUserError(); });

        return user;
    }
}