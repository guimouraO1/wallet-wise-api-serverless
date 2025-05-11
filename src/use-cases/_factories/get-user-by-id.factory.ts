import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository';
import { GetUserByIdUseCase } from '../user/get-user-by-id.use-case';

export function getUserByIdFactory() {
    const usersRepository = new PrismaUsersRepository();
    const getUserByIdUseCase = new GetUserByIdUseCase(usersRepository);

    return getUserByIdUseCase;
}