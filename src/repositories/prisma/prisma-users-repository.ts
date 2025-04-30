import { prisma } from '../../utils/lib/prisma';
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
        const user = await prisma.user.create({
            data,
            omit: {
                password: true
            },
            include: { Account: true }
        });

        return user;
    }
}