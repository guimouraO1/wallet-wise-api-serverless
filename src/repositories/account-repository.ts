import { TransactionType } from './transaction-repository';

export type Account = {
    id: string;
    balance: number;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
}

export type CreateAccount = {
    userId: string;
}

export type UpdateAccountInput = {
    amount: number;
    type: TransactionType;
    accountId: string;
}

export interface AccountRepository {
    create(data: CreateAccount): Promise<Account>;
    getByUserId(userId: string): Promise<Account | null>;
    getByAccountId(accountId: string): Promise<Account | null>;
    update(data: UpdateAccountInput): Promise<Account>;
}