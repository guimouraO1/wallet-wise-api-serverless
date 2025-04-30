import { hash } from 'bcryptjs';
import { UsersRepository } from '../repositories/users-repository';
import { PASSWORD_HASH_ROUNDS } from '../utils/constants/password-hash-rounds';
import { UserAlreadyExistsError } from '../utils/errors/user-already-exists-error';
import { CreateUserBodyType } from '../utils/schemas/request/user/create-user.schema';
import { UserNotFoundError } from '../utils/errors/user-not-found-error';
import { AccountRepository } from '../repositories/account-repository';
import { CreateUserError } from '../utils/errors/create-user-error';

export class UserService {
    constructor(private usersRepository: UsersRepository, private accountRepository: AccountRepository) {}

    async create({ email, name, password, avatarUrl }: CreateUserBodyType) {
        const userAlreadyExists = await this.usersRepository.getByEmail(email);

        if (userAlreadyExists) {
            throw new UserAlreadyExistsError();
        }

        const password_hashed = await hash(password, PASSWORD_HASH_ROUNDS);

        try {
            const user = await this.usersRepository.create({
                name,
                email,
                password: password_hashed,
                ...(avatarUrl ? { avatarUrl } : {})
            });

            await this.accountRepository.create({ userId: user.id });

            return user;
        } catch {
            throw new CreateUserError();
        }
    }

    async getUserById(userId: string) {
        const user = await this.usersRepository.getById(userId).catch(() => {
            throw new UserNotFoundError();
        });

        return user;
    }
}