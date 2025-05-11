import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository';
import { CreateUserUseCase } from '../user/create-user.use-case';

export function createUserFactory() {
    const usersRepository = new PrismaUsersRepository();
    const createUserUseCase = new CreateUserUseCase(usersRepository);

    return createUserUseCase;
}