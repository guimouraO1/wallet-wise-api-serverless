import { randomUUID } from 'node:crypto';
import { Transaction, TransactionCreateInput, TransactionRepository } from '../transaction-repository';
import { FindManyTransactionsSchemaType } from '../../utils/schemas/transactions/find-many-transactions-schema';

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

    async findManyByAccountId(data: FindManyTransactionsSchemaType) {
        const transactions = this.items.filter((item) => item.accountId === data.accountId).slice((data.page - 1) * data.offset, data.page * data.offset);
        const response = {
            transactionsCount: this.items.length,
            transactions
        };
        return response;
    }

    async findManyInPeriodByAccountId(accountId: string, startDate: Date, endDate: Date) {
        const transactions = this.items.filter((item) => item.accountId === accountId && item.createdAt >= startDate && item.createdAt <= endDate);
        const response = {
            transactionsCount: this.items.length,
            transactions
        };
        return response;
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