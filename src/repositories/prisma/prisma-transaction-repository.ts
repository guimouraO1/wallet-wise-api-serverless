import { GetPaginatedTransactionsInternalType } from '../../utils/schemas/internal/transactions/get-paginated-transactions.schema';
import { prisma } from '../../utils/lib/prisma';
import { Transaction, TransactionCreateInput, TransactionRepository, TransactionsAndCount } from '../transaction-repository';
import { GetTransactionsInPeriodInternalType } from '../../utils/schemas/internal/transactions/get-transactions-in-period.schema';
import { DateTime } from 'luxon';
import { TIMEZONE } from '../../utils/constants/timezone';

export class PrismaTransactionRepository implements TransactionRepository {
    async getByAccountId(data: GetPaginatedTransactionsInternalType) {
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

    async getByAccountIdInPeriod({ accountId, startDate, endDate, type }: GetTransactionsInPeriodInternalType) {
        const startDateFormated = DateTime.fromFormat(startDate, 'dd-MM-yyyy', { zone: TIMEZONE }).startOf('day').toJSDate();
        const endDateFormated = DateTime.fromFormat(endDate, 'dd-MM-yyyy', { zone: TIMEZONE }).endOf('day').toJSDate();

        const whereClause = {
            accountId,
            deleted: false,
            ...(type ? { type } : {}),
            createdAt: {
                gte: startDateFormated,
                lte: endDateFormated
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