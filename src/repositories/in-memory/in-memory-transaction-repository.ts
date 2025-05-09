import { randomUUID } from 'node:crypto';
import { Transaction, TransactionCreateInput, TransactionRepository } from '../transaction-repository';
import { GetPaginatedTransactionsInternalType } from '../../utils/schemas/internal/transactions/get-paginated-transactions.schema';
import { GetTransactionsInPeriodInternalType } from '../../utils/schemas/internal/transactions/get-transactions-in-period.schema';
import { DateTime } from 'luxon';
import { TIMEZONE } from '../../utils/constants/timezone';
import { GetTransactionsSummaryByAccountIdAndYearType } from '../../utils/schemas/internal/transactions/get-transactions-summary-by-account-id-and-year.schema';

export class InMemoryTransactionRepository implements TransactionRepository {
    public items: Transaction[] = [];

    async create(data: TransactionCreateInput) {
        const transaction: Transaction = {
            name: data.name,
            id: randomUUID(),
            description: data.description ?? null,
            amount: data.amount,
            createdAt: new Date(),
            updatedAt: new Date(),
            type: data.type,
            paymentMethod: data.paymentMethod,
            accountId: data.accountId
        };

        this.items.push(transaction);

        return transaction;
    }

    async getByAccountId(data: GetPaginatedTransactionsInternalType) {
        const transactions = this.items.filter((item) => item.accountId === data.accountId).slice((data.page - 1) * data.offset, data.page * data.offset);
        const response = {
            transactionsCount: this.items.length,
            transactions
        };
        return response;
    }

    async getByAccountIdInPeriod({ accountId, startDate, endDate, type }: GetTransactionsInPeriodInternalType) {
        const startDateFormated = DateTime.fromFormat(startDate, 'dd-MM-yyyy', { zone: TIMEZONE }).startOf('day').toJSDate();
        const endDateFormated = DateTime.fromFormat(endDate, 'dd-MM-yyyy', { zone: TIMEZONE }).endOf('day').toJSDate();

        const transactions = this.items.filter((item) => {
            const matchesAccount = item.accountId === accountId;
            const inPeriod = item.createdAt >= startDateFormated && item.createdAt <= endDateFormated;
            const matchesType = type ? item.type === type : true;

            return matchesAccount && inPeriod && matchesType;
        });

        const response = {
            transactionsCount: transactions.length,
            transactions
        };

        return response;
    }

    async getTransactionsSummaryByAccountIdAndYear({ accountId, year, type }: GetTransactionsSummaryByAccountIdAndYearType) {

        const startOfYear = DateTime.fromObject({ year: Number(year) }, { zone: TIMEZONE }).startOf('year').toJSDate();
        const endOfYear = DateTime.fromObject({ year: Number(year) }, { zone: TIMEZONE }).endOf('year').toJSDate();

        const transactions = this.items.filter(item => {
            const matchesAccount = item.accountId === accountId;
            const inYear = item.createdAt >= startOfYear && item.createdAt <= endOfYear;
            const matchesType = type ? item.type === type : true;
            return matchesAccount && inYear && matchesType;
        });

        const monthlySummary = Array.from({ length: 12 }, (_, i) => {
            const month = i + 1;
            const monthName = DateTime.fromObject({ month }, { zone: TIMEZONE }).toFormat('LLLL');

            const monthAmount = transactions.filter(t => DateTime.fromJSDate(t.createdAt).month === month)
                .reduce((sum, t) => sum + Number(t.amount), 0);

            return { name: monthName, value: monthAmount };
        });

        return monthlySummary;
    }

    async delete(transactionId: string) {
        const deletedTransaction = this.items.find(item => item.id === transactionId);

        if (!deletedTransaction) {
            return null;
        }

        this.items = this.items.filter(item => item.id !== transactionId);

        return deletedTransaction;
    }

}