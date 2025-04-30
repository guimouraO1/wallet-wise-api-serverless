import { User, UsersRepository } from '../repositories/users-repository';
import { InvalidCredentialsError } from '../utils/errors/invalid-credentials-error';
import { compare } from 'bcryptjs';
import { SignInBodyType } from '../utils/schemas/request/auth/sign-in.schema';

export class AuthService {
    constructor(private usersRepository: UsersRepository) {}

    async signIn({ email, password }: SignInBodyType): Promise<User> {
        const user = await this.usersRepository.getByEmail(email);

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