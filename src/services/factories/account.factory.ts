import { PrismaAccountRepository } from '../../repositories/prisma/prisma-account-repository';
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository';
import { AccountService } from '../account.service';

export function accountFactory() {
    const usersRepository = new PrismaUsersRepository();
    const accountRepository = new PrismaAccountRepository();
    const accountService = new AccountService(accountRepository, usersRepository);

    return accountService;
}