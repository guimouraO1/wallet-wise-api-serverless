
import { compare } from 'bcryptjs';
import { UsersRepository } from '../../repositories/users-repository';
import { InvalidCredentialsError } from '../../utils/errors/invalid-credentials-error';
import { UserNotFoundError } from '../../utils/errors/user-not-found-error';
import { SignIn } from '../../utils/types/auth/sign-in';

export class SignInUseCase {
    constructor(private usersRepository: UsersRepository) {}

    async execute({ email, password }: SignIn) {
        const user = await this.usersRepository.getByEmail(email);
        if (!user) {
            throw new UserNotFoundError();
        }

        const doesPasswordMathes = await compare(password, user.password);
        if (!doesPasswordMathes) {
            throw new InvalidCredentialsError();
        }

        const { password:  _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}