import { PrismaAccountRepository } from '../../repositories/prisma/prisma-account-repository';
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository';
import { UserService } from '../user.service';

export function userFactory() {
    const usersRepository = new PrismaUsersRepository();
    const accountRepository = new PrismaAccountRepository();
    const userService = new UserService(usersRepository, accountRepository);

    return userService;
}