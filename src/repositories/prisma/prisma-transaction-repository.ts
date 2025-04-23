import { FindManyTransactionsSchemaType } from '@/utils/schemas/transactions/find-many-transactions-schema';
import { prisma } from '../../utils/lib/prisma';
import { Transaction, TransactionCreateInput, TransactionRepository, TransactionsAndCount } from '../transaction-repository';

export class PrismaTransactionRepository implements TransactionRepository {
    async findManyByAccountId(data: FindManyTransactionsSchemaType) {
        const whereClause = {
            accountId: data.accountId,
            deleted: false,
            ...(data.type ? { type: data.type } : {}),
            ...(data.paymentMethod ? { paymentMethod: data.paymentMethod } : {}),
            ...(data.name ? { name: { contains: data.name, mode: 'insensitive' as const } } : {})
        };

        const transactions: Transaction[] = await prisma.transaction.findMany({
            where: whereClause,
            skip: (data.page - 1) * data.offset,
            take: data.offset,
            orderBy: {
                createdAt: 'desc'
            }
        });

        const count = await prisma.transaction.count({
            where: whereClause
        });

        const response: TransactionsAndCount = {
            transactionsCount: count,
            transactions
        };

        return response;
    }

    async findManyInPeriodByAccountId(accountId: string, startDate: Date, endDate: Date) {
        const whereClause = {
            accountId,
            deleted: false,
            createdAt: {
                gte: startDate,
                lte: endDate
            }
        };

        const transactions: Transaction[] = await prisma.transaction.findMany({
            where: whereClause,
            orderBy: {
                createdAt: 'desc'
            }
        });

        const count = await prisma.transaction.count({
            where: whereClause
        });

        const response: TransactionsAndCount = {
            transactionsCount: count,
            transactions
        };

        return response;
    }

    async create(data: TransactionCreateInput) {
        const transaction = await prisma.transaction.create({
            data
        });

        return transaction;
    }

    async delete(transactionId: string) {
        const transaction = await prisma.transaction.update({
            where: {
                id: transactionId
            },
            data: {
                deleted: true
            }
        });

        return transaction;
    }
}