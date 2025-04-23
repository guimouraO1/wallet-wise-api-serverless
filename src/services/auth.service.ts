import { User, UsersRepository } from '../repositories/users-repository';
import { InvalidCredentialsError } from '../utils/errors/invalid-credentials-error';
import { compare } from 'bcryptjs';
import { AuthenticateRequestBody } from '../utils/schemas/auth/sign-in.schema';

export class AuthService {
    constructor(private usersRepository: UsersRepository) {}

    async authenticate({ email, password }: AuthenticateRequestBody): Promise<User> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new InvalidCredentialsError();
        }

        const doesPasswordMathes = await compare(password, user.password);

        if (!doesPasswordMathes) {
            throw new InvalidCredentialsError();
        }

        return user;
    }
}