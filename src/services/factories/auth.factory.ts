import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository';
import { AuthService } from '../auth.service';

export function authFactory() {
    const usersRepository = new PrismaUsersRepository();
    const authService = new AuthService(usersRepository);

    return authService;
}