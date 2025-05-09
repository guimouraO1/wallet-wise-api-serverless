import { GetPaginatedTransactionsInternalType } from '../../utils/schemas/internal/transactions/get-paginated-transactions.schema';
import { prisma } from '../../utils/lib/prisma';
import { Transaction, TransactionCreateInput, TransactionRepository, TransactionsAndCount } from '../transaction-repository';
import { GetTransactionsInPeriodInternalType } from '../../utils/schemas/internal/transactions/get-transactions-in-period.schema';
import { DateTime } from 'luxon';
import { TIMEZONE } from '../../utils/constants/timezone';
import { GetTransactionsSummaryByAccountIdAndYearType } from '../../utils/schemas/internal/transactions/get-transactions-summary-by-account-id-and-year.schema';

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

    async getTransactionsSummaryByAccountIdAndYear({ accountId, year, type }: GetTransactionsSummaryByAccountIdAndYearType) {
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