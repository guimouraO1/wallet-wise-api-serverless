import { randomUUID } from 'node:crypto';
import { Account, AccountRepository, CreateAccount, UpdateAccountInput } from '../account-repository';

export class InMemoryAccountsRepository implements AccountRepository {
    public items: Account[] = [];

    async create(data: CreateAccount) {
        const account: Account = {
            id: randomUUID(),
            balance: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: data.userId
        };

        this.items.push(account);

        return account;
    }

    async findByUserId(userId: string) {
        const account = this.items.find((item) => item.userId === userId);

        return account ?? null;
    }

    async findByAccountId(accountId: string) {
        const account = this.items.find((item) => item.id === accountId);

        return account ?? null;
    }

    async updateAccount(data: UpdateAccountInput) {
        const index = this.items.findIndex(item => item.id === data.accountId);

        this.items[index].balance = data.type === 'withdraw'
            ? this.items[index].balance - data.amount
            : this.items[index].balance + data.amount;

        return this.items[index];
    }
}