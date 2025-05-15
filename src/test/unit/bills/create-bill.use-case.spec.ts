import { fakerPT_BR } from '@faker-js/faker';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { InMemoryAccountsRepository } from '../../../repositories/in-memory/in-memory-account-repository';
import { InMemoryBillRepository } from '../../../repositories/in-memory/in-memory-bill-repository';
import { CreateBillUseCase } from '../../../use-cases/bills/create-bill.use-case';
import { AccountNotFoundError } from '../../../utils/errors/account-not-found-error';
import { Account } from '../../../utils/types/account/account';
import { BillFrequencyEnum, BillTypeEnum } from '../../../utils/types/bills/bill';
import { CreateBill } from '../../../utils/types/bills/create-bill';

let accountRepository: InMemoryAccountsRepository;
let billRepository: InMemoryBillRepository;
let sut: CreateBillUseCase;
let account: Account;
let bill: CreateBill;

describe('Create Bill Use Case', () => {
    beforeEach(async () => {
        accountRepository = new InMemoryAccountsRepository();
        billRepository = new InMemoryBillRepository();
        sut = new CreateBillUseCase(billRepository, accountRepository);

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
            dueDay: fakerPT_BR.number.int({ min: 1, max: 26 }),
            description: fakerPT_BR.finance.transactionDescription()
        };
    });

    afterEach(() => {
        accountRepository.items = [];
        billRepository.items = [];
    });

    it('should be able to create bill', async () => {
        const billCreated = await sut.execute(bill);

        expect(billCreated).toBeDefined();
        expect(billCreated.accountId).toEqual(bill.accountId);
        expect(billCreated.amount).toEqual(bill.amount);
        expect(billCreated.billType).toEqual(bill.billType);
        expect(billCreated.name).toEqual(bill.name);
        expect(billCreated.paidInstallments).toEqual(bill.paidInstallments);
        expect(billCreated.installments).toEqual(bill.installments);
        expect(billCreated.active).toEqual(bill.active);

        expect(typeof billCreated.id).toBe('string');
        expect(billCreated.createdAt).toBeInstanceOf(Date);
    });

    it('should not be able to create bill if account do not exist', async () => {
        await expect(sut.execute({ ...bill, accountId: fakerPT_BR.string.uuid() })).rejects.toBeInstanceOf(AccountNotFoundError);
    });
});