import { randomUUID } from 'node:crypto';
import { Account } from '../../utils/types/account/account';
import { UpdateAccount } from '../../utils/types/account/update-account';
import { AccountRepository } from '../account-repository';

export class InMemoryAccountsRepository implements AccountRepository {
    public items: Account[] = [];

    async create(userId: string) {
        const account: Account = {
            id: randomUUID(),
            balance: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId
        };

        this.items.push(account);

        return account;
    }

    async getByUserId(userId: string) {
        const account = this.items.find((item) => item.userId === userId);
        return account ?? null;
    }

    async get(accountId: string) {
        const account = this.items.find((item) => item.id === accountId);
        return account ?? null;
    }

    async update(data: UpdateAccount) {
        const index = this.items.findIndex(item => item.id === data.accountId);

        this.items[index].balance = data.type === 'withdraw'
            ? this.items[index].balance - data.balance
            : this.items[index].balance + data.balance;

        return this.items[index];
    }
}