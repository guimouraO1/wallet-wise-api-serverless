import { fakerPT_BR } from '@faker-js/faker';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { InMemoryAccountsRepository } from '../../../repositories/in-memory/in-memory-account-repository';
import { InMemoryBillRepository } from '../../../repositories/in-memory/in-memory-bill-repository';
import { GetBillsUseCase } from '../../../use-cases/bills/get-bills.use-case';
import { AccountNotFoundError } from '../../../utils/errors/account-not-found-error';
import { Account } from '../../../utils/types/account/account';
import { BillFrequencyEnum, BillTypeEnum } from '../../../utils/types/bills/bill';

let accountRepository: InMemoryAccountsRepository;
let billRepository: InMemoryBillRepository;
let sut: GetBillsUseCase;
let account: Account;

describe('Get Bills Use Case', () => {
    beforeEach(async () => {
        accountRepository = new InMemoryAccountsRepository();
        billRepository = new InMemoryBillRepository();
        sut = new GetBillsUseCase(billRepository, accountRepository);

        account = await accountRepository.create(fakerPT_BR.string.uuid());
    });

    afterEach(() => {
        accountRepository.items = [];
        billRepository.items = [];
    });

    it('should be able to get paginated bills', async () => {
        const bill = {
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

        const bill2 = {
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

        await billRepository.create(bill);
        await billRepository.create(bill2);

        const { bills, billsCount } = await sut.execute({ accountId: account.id, page: 2, offset: 1 });

        expect(bills).toBeTypeOf('object');
        expect(billsCount).toEqual(2);
        expect(bills.length).toEqual(1);
        expect(bills[0].accountId).toEqual(bill2.accountId);
        expect(bills[0].active).toEqual(bill2.active);
        expect(bills[0].amount).toEqual(bill2.amount);
        expect(bills[0].name).toEqual(bill2.name);
        expect(bills[0].description).toEqual(bill2.description);
    });

    it('should not be able to get bills if account do not exist', async () => {
        await expect(sut.execute({ accountId: fakerPT_BR.string.uuid(), page: 1, offset: 1 })).rejects.toBeInstanceOf(AccountNotFoundError);
    });

    it('should be able to get paginated bills filtered by bill type', async () => {
        const bill = {
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

        const bill2 = {
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

        await billRepository.create({ ...bill, billType: BillTypeEnum.Installment });
        await billRepository.create({ ...bill2, billType: BillTypeEnum.Recurring });

        const { bills, billsCount } = await sut.execute({ accountId: account.id, page: 1, offset: 1, billType: BillTypeEnum.Recurring });

        expect(bills[0].accountId).toEqual(bill2.accountId);
        expect(bills[0].active).toEqual(bill2.active);
        expect(bills[0].name).toEqual(bill2.name);
        expect(bills[0].description).toEqual(bill2.description);
    });

    it('should be able to get paginated bills filtered by active', async () => {
        const bill = {
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

        const bill2 = {
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

        await billRepository.create({ ...bill, active: true });
        await billRepository.create({ ...bill2, active: false });

        const { bills, billsCount } = await sut.execute({ accountId: account.id, page: 1, offset: 1, active: false });

        expect(bills).toBeTypeOf('object');
        expect(bills[0].accountId).toEqual(bill2.accountId);
        expect(bills[0].name).toEqual(bill2.name);
        expect(bills[0].description).toEqual(bill2.description);
    });

    // it('should be able to get paginated bills filtered by bill type', async () => {
    //     const bill = { // AJUSTAR ERRO
    //         accountId: account.id,
    //         amount: +fakerPT_BR.finance.amount({ min: 1, max: 10_000 }),
    //         billType: fakerPT_BR.helpers.enumValue(BillTypeEnum),
    //         frequency: BillFrequencyEnum.Annual,
    //         name: fakerPT_BR.company.name(),
    //         paidInstallments: fakerPT_BR.number.int({ min: 1, max: 20 }),
    //         installments: fakerPT_BR.number.int({ min: 20, max: 40 }),
    //         active: fakerPT_BR.datatype.boolean(),
    //         description: fakerPT_BR.finance.transactionDescription(),
    //         dueDay: 4
    //     };

    //     const bill2 = {
    //         ...bill,
    //         frequency: BillFrequencyEnum.Monthly
    //     };

    //     const bill3 = {
    //         ...bill,
    //         frequency: BillFrequencyEnum.Weekly
    //     };

    //     await billRepository.create(bill);
    //     await billRepository.create(bill2);
    //     await billRepository.create(bill3);

    //     const { bills, billsCount } = await sut.execute({ accountId: account.id, page: 1, offset: 1 });

    //     expect(bills).toBeInstanceOf(Array);
    //     expect(billsCount).toEqual(1);
    //     expect(bills[0].name).toEqual(bill3.name);
    //     expect(bills[0].description).toEqual(bill3.description);
    // });
});