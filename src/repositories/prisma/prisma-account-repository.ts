import { prisma } from '../../utils/lib/prisma';
import { AccountRepository, CreateAccount, UpdateAccountInput } from '../account-repository';

export class PrismaAccountRepository implements AccountRepository {
    async create(data: CreateAccount) {
        const account = await prisma.account.create({
            data
        });

        return account;
    }

    async findByUserId(userId: string) {
        const account = await prisma.account.findUnique({
            where: { userId }
        });

        return account;
    }

    async findByAccountId(accountId: string) {
        const account = await prisma.account.findUnique({
            where: { id: accountId }
        });

        return account;
    }

    async updateAccount(data: UpdateAccountInput) {
        const account = await prisma.account.update({
            data: {
                balance: data.type === 'withdraw'
                    ? { decrement: data.amount }
                    : { increment: data.amount }
            },
            where: { id: data.accountId }
        });

        return account;
    }
}