import { Account } from '../utils/types/account/account';
import { UpdateAccount } from '../utils/types/account/update-account';

export interface AccountRepository {
    create(userId: string): Promise<Account>;
    getByUserId(userId: string): Promise<Account | null>;
    get(accountId: string): Promise<Account | null>;
    update(data: UpdateAccount): Promise<Account>;
}