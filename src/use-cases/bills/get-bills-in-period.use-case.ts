import { DateTime } from 'luxon';
import { AccountRepository } from '../../repositories/account-repository';
import { BillRepository } from '../../repositories/bill-repository';
import { TIMEZONE } from '../../utils/constants/timezone';
import { AccountNotFoundError } from '../../utils/errors/account-not-found-error';

export class GetBillsInPeriodUseCase {
    constructor(private billRepository: BillRepository, private accountRepository: AccountRepository)  {}

    async execute(accountId: string, startDate: string, endDate: string) {
        const accountExists = await this.accountRepository.get(accountId);
        if (!accountExists) {
            throw new AccountNotFoundError();
        }

        const startDateFormated = DateTime.fromFormat(startDate, 'dd-MM-yyyy', { zone: TIMEZONE }).startOf('day').toJSDate();
        const endDateFormated = DateTime.fromFormat(endDate, 'dd-MM-yyyy', { zone: TIMEZONE }).endOf('day').toJSDate();

        const bills = await this.billRepository.getByAccountIdInPeriod(accountId, startDateFormated, endDateFormated);
        console.log(bills);
        return bills;
    }
}