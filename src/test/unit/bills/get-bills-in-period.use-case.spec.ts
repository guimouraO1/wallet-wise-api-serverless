import { fakerPT_BR } from '@faker-js/faker';
import { DateTime } from 'luxon';
import { afterEach, beforeEach, describe, it } from 'vitest';
import { InMemoryAccountsRepository } from '../../../repositories/in-memory/in-memory-account-repository';
import { InMemoryBillRepository } from '../../../repositories/in-memory/in-memory-bill-repository';
import { GetBillsInPeriodUseCase } from '../../../use-cases/bills/get-bills-in-period.use-case';
import { TIMEZONE } from '../../../utils/constants/timezone';
import { AccountNotFoundError } from '../../../utils/errors/account-not-found-error';
import { Account } from '../../../utils/types/account/account';
import { BillFrequencyEnum, BillTypeEnum } from '../../../utils/types/bills/bill';
import { CreateBill } from '../../../utils/types/bills/create-bill';

let accountRepository: InMemoryAccountsRepository;
let billRepository: InMemoryBillRepository;
let sut: GetBillsInPeriodUseCase;
let account: Account;
let bill: CreateBill;

describe('Get Bills In Period Use Case', () => {
    beforeEach(async () => {
        accountRepository = new InMemoryAccountsRepository();
        billRepository = new InMemoryBillRepository();
        sut = new GetBillsInPeriodUseCase(billRepository, accountRepository);

        account = await accountRepository.create(fakerPT_BR.string.uuid());
        bill = {
            accountId: account.id,
            amount: +fakerPT_BR.finance.amount({ min: 1, max: 10_000 }),
            billType: fakerPT_BR.helpers.enumValue(BillTypeEnum),
            frequency: fakerPT_BR.helpers.enumValue(BillFrequencyEnum),
            name: fakerPT_BR.company.name(),
            paidInstallments: fakerPT_BR.number.int({ min: 1, max: 20 }),
            installments: fakerPT_BR.number.int({ min: 20, max: 40 }),
            active: fakerPT_BR.datatype.boolean(),
            description: fakerPT_BR.finance.transactionDescription(),
            dueDay: fakerPT_BR.number.int({ min: 1, max: 26 })
        };
    });

    afterEach(() => {
        accountRepository.items = [];
        billRepository.items = [];
    });

    it('should be able to get bills in period', async () => {
        const now = DateTime.now().setZone(TIMEZONE);
        const startDate = now.minus({ days: 31 }).startOf('day').toJSDate();
        const endDate = now.endOf('day').toJSDate();

        await billRepository.create({ ...bill, createdAt: now.minus({ days: 10 }).startOf('day').toJSDate() });
        await billRepository.create({ ...bill, createdAt: now.minus({ days: 40 }).startOf('day').toJSDate(), name: fakerPT_BR.company.name() });

        const { bills, billsCount } = await sut.execute(
            account.id,
            DateTime.fromJSDate(startDate).toFormat('dd-MM-yyyy'),
            DateTime.fromJSDate(endDate).toFormat('dd-MM-yyyy')
        );

        expect(bills).toBeTypeOf('object');
        expect(billsCount).toEqual(1);
        expect(bills[0].accountId).toEqual(bill.accountId);
        expect(bills[0].active).toEqual(bill.active);
        expect(bills[0].amount).toEqual(bill.amount);
        expect(bills[0].name).toEqual(bill.name);
        expect(bills[0].description).toEqual(bill.description);
    });

    it('should not be able to get bills in period if account do not exist', async () => {
        await expect(sut.execute(fakerPT_BR.string.uuid(),
            DateTime.now().toFormat('dd-MM-yyyy'),
            DateTime.now().minus({ days: 31 }).toFormat('dd-MM-yyyy'))).rejects.toBeInstanceOf(AccountNotFoundError);
    });
});