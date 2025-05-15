import { prisma } from '../../utils/libs/prisma';
import { CreateUser } from '../../utils/types/user/create-user';
import { UsersRepository } from '../users-repository';

export class PrismaUsersRepository implements UsersRepository {
    async getById(id: string) {
        const user = await prisma.user.findUnique({ where: { id }, include: { Account: true } });
        return user;
    }

    async getByEmail(email: string) {
        const user = await prisma.user.findUnique({ where: { email }, include: { Account: true } });
        return user;
    }

    async create(data: CreateUser) {
        const result = await prisma.$transaction(async (transaction) => {
            const user = await transaction.user.create({ data });
            const account = await transaction.account.create({ data: { userId: user.id } });

            return { ...user, Account: [account] };
        });

        return result;
    }
}