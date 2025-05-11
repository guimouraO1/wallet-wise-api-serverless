import { PrismaAccountRepository } from '../../repositories/prisma/prisma-account-repository';
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository';
import { GetAccountByUserIdUseCase } from '../../use-cases/account/get-account-by-user-id.use-case';

export function getAccountByUserIdFactory() {
    const usersRepository = new PrismaUsersRepository();
    const accountRepository = new PrismaAccountRepository();
    const getAccountByUserIdUseCase = new GetAccountByUserIdUseCase(accountRepository, usersRepository);

    return getAccountByUserIdUseCase;
}