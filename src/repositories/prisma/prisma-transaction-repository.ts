import { DateTime } from 'luxon';
import { TIMEZONE } from '../../utils/constants/timezone';
import { prisma } from '../../utils/libs/prisma';
import { CreateTransaction } from '../../utils/types/transactions/create-transaction';
import { GetPaginatedTransactionsInternal } from '../../utils/types/transactions/internal/get-paginated-transactions';
import { GetTransactionsInPeriodInternal } from '../../utils/types/transactions/internal/get-transactions-in-period';
import { GetTransactionsSummary } from '../../utils/types/transactions/internal/get-transactions-summary';
import { TransactionRepository } from '../transaction-repository';

export class PrismaTransactionRepository implements TransactionRepository {
    async getById(transactionId: string) {
        const transaction = await prisma.transaction.findUnique({
            where: { id: transactionId, deleted: false }
        });

        return transaction;
    }

    async getPaginated(data: GetPaginatedTransactionsInternal) {
        const whereClause = {
            accountId: data.accountId,
            deleted: false,
            ...(data.type ? { type: data.type } : {}),
            ...(data.paymentMethod ? { paymentMethod: data.paymentMethod } : {}),
            ...(data.name ? { name: { contains: data.name, mode: 'insensitive' as const } } : {})
        };

        const transactions = await prisma.transaction.findMany({
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

        const response = {
            transactionsCount: count,
            transactions
        };

        return response;
    }

    async getInPeriod({ accountId, startDate, endDate, type }: GetTransactionsInPeriodInternal) {
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

        const transactions = await prisma.transaction.findMany({
            where: whereClause,
            orderBy: {
                createdAt: 'desc'
            }
        });

        const count = await prisma.transaction.count({
            where: whereClause
        });

        const response = {
            transactionsCount: count,
            transactions
        };

        return response;
    }

    async create(data: CreateTransaction) {
        const result = await prisma.$transaction(async (prisma) => {
            const transaction = await prisma.transaction.create({ data });
            await prisma.account.update({
                data: { balance: data.type === 'withdraw' ? { decrement: data.amount } : { increment: data.amount } },
                where: { id: data.accountId }
            });

            return transaction;
        });

        return result;
    }

    async delete(transactionId: string) {
        const transaction = await prisma.transaction.update({
            where: { id: transactionId },
            data: {
                deleted: true
            }
        });

        return transaction;
    }

    async getSummary({ accountId, year, type }: GetTransactionsSummary) {
        const startOfYear = DateTime.fromObject({ year: Number(year) }, { zone: TIMEZONE }).startOf('year').toJSDate();
        const endOfYear = DateTime.fromObject({ year: Number(year) }, { zone: TIMEZONE }).endOf('year').toJSDate();

        const transactions = await prisma.transaction.findMany({
            where: {
                accountId,
                deleted: false,
                createdAt: {
                    gte: startOfYear,
                    lte: endOfYear
                },
                ...(type ? { type }: {})
            },
            select: {
                amount: true,
                createdAt: true
            }
        });

        const monthlySummary = Array.from({ length: 12 }, (_, i) => {
            const month = i + 1;
            const monthName = DateTime.fromObject({ month }).toFormat('LLLL');

            const monthAmount = transactions.filter((t) => DateTime.fromJSDate(t.createdAt).month === month)
                .reduce((sum, t) => sum + Number(t.amount), 0);

            return { name: monthName, value: monthAmount };
        });

        return monthlySummary;
    }
}