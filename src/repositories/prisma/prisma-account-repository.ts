import { prisma } from '../../utils/libs/prisma';
import { UpdateAccount } from '../../utils/types/account/update-account';
import { AccountRepository } from '../account-repository';

export class PrismaAccountRepository implements AccountRepository {
    async create(userId: string) {
        const account = await prisma.account.create({ data: { userId } });
        return account;
    }

    async getByUserId(userId: string) {
        const account = await prisma.account.findUnique({
            where: { userId }
        });

        return account;
    }

    async get(accountId: string) {
        const account = await prisma.account.findUnique({
            where: { id: accountId }
        });

        return account;
    }

    async update(data: UpdateAccount) {
        const account = await prisma.account.update({
            data: { balance: data.type === 'withdraw' ? { decrement: data.balance } : { increment: data.balance } },
            where: { id: data.accountId }
        });

        return account;
    }
}