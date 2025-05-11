import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository';
import { SignInUseCase } from '../auth/sign-in.use-case';

export function signInFactory() {
    const usersRepository = new PrismaUsersRepository();
    const signInUseCase = new SignInUseCase(usersRepository);

    return signInUseCase;
}