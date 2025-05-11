
import { compare } from 'bcryptjs';
import { UsersRepository } from '../../repositories/users-repository';
import { InvalidCredentialsError } from '../../utils/errors/invalid-credentials-error';
import { SignInBodyType } from '../../utils/schemas/request/auth/sign-in.schema';
import { UserNotFoundError } from '../../utils/errors/user-not-found-error';

export class SignInUseCase {
    constructor(private usersRepository: UsersRepository) {}

    async execute({ email, password }: SignInBodyType) {
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