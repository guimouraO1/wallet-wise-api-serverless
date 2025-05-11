import { prisma } from '../../utils/libs/prisma';
import { UserCreateInput, UsersRepository } from '../users-repository';

export class PrismaUsersRepository implements UsersRepository {
    async getById(id: string) {
        const user = await prisma.user.findUnique({ where: { id }, omit: { password: true }, include: { Account: true } });
        return user;
    }

    async getByEmail(email: string) {
        const user = await prisma.user.findUnique({ where: { email }, include: { Account: true } });
        return user;
    }

    async create(data: UserCreateInput) {
        const result = await prisma.$transaction(async (transaction) => {
            const user = await transaction.user.create({ data });
            await transaction.account.create({ data: { userId: user.id } });

            return user;
        });

        return result;
    }
}