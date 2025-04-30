import { Account, AccountRepository, UpdateAccountInput } from '../repositories/account-repository';
import { UsersRepository } from '../repositories/users-repository';
import { AccountAlreadyExistsError } from '../utils/errors/account-already-exists-error';
import { AccountNotFoundError } from '../utils/errors/account-not-found-error';
import { UserNotFoundError } from '../utils/errors/user-not-found-error';

export class AccountService {
    constructor(private accountRepository: AccountRepository, private usersRepository: UsersRepository) {}

    async create(userId: string): Promise<Account> {
        const userExists = await this.usersRepository.getById(userId);
        if (!userExists) {
            throw new UserNotFoundError();
        }

        const accountAlreadyExists = await this.accountRepository.getByUserId(userId);
        if (accountAlreadyExists) {
            throw new AccountAlreadyExistsError();
        }

        const account = await this.accountRepository.create({ userId });

        return account;
    }

    async getAccountByUserId(userId: string): Promise<Account>  {
        const userExists = await this.usersRepository.getById(userId);
        if (!userExists) {
            throw new UserNotFoundError();
        }

        const account = await this.accountRepository.getByUserId(userId);
        if (!account) {
            throw new AccountNotFoundError();
        }

        return account;
    }

    async update(data: UpdateAccountInput): Promise<Account>  {
        const accountExists = await this.accountRepository.getByAccountId(data.accountId);
        if (!accountExists) {
            throw new AccountNotFoundError();
        }

        const account = await this.accountRepository.update(data);

        return account;
    }
}
