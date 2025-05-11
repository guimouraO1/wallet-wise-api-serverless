import { Account, AccountRepository } from '../../repositories/account-repository';
import { UsersRepository } from '../../repositories/users-repository';
import { AccountNotFoundError } from '../../utils/errors/account-not-found-error';
import { UserNotFoundError } from '../../utils/errors/user-not-found-error';

export class GetAccountByUserIdUseCase {
    constructor(private accountRepository: AccountRepository, private usersRepository: UsersRepository) {}

    async execute(userId: string) {
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
}
