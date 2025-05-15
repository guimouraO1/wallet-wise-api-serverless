import { AccountRepository } from '../../repositories/account-repository';
import { BillRepository, FindManyBillsInput } from '../../repositories/bill-repository';
import { AccountNotFoundError } from '../../utils/errors/account-not-found-error';

export class GetBillsUseCase {
    constructor(private billRepository: BillRepository, private accountRepository: AccountRepository)  {}

    async execute(data: FindManyBillsInput) {
        const accountExists = await this.accountRepository.get(data.accountId);
        if (!accountExists) {
            throw new AccountNotFoundError();
        }

        const bills = await this.billRepository.getByAccountId(data);
        return bills;
    }
}