import { AccountRepository } from '../../repositories/account-repository';
import { BillCreateInput, BillRepository } from '../../repositories/bill-repository';
import { AccountNotFoundError } from '../../utils/errors/account-not-found-error';

export class CreateBillUseCase {
    constructor(private billRepository: BillRepository, private accountRepository: AccountRepository)  {}

    async execute(data: BillCreateInput) {
        const accountExists = await this.accountRepository.get(data.accountId);
        if (!accountExists) {
            throw new AccountNotFoundError();
        }

        const bill = await this.billRepository.create(data);
        return bill;
    }
}