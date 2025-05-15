import { fakerPT_BR } from '@faker-js/faker';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { InMemoryAccountsRepository } from '../../../repositories/in-memory/in-memory-account-repository';
import { InMemoryBillRepository } from '../../../repositories/in-memory/in-memory-bill-repository';
import { DeleteBillUseCase } from '../../../use-cases/bills/delete-bill.use-case';
import { BillNotFoundError } from '../../../utils/errors/bill-not-found-error';
import { Account } from '../../../utils/types/account/account';
import { BillFrequencyEnum, BillTypeEnum } from '../../../utils/types/bills/bill';
import { CreateBill } from '../../../utils/types/bills/create-bill';

let accountRepository: InMemoryAccountsRepository;
let billRepository: InMemoryBillRepository;
let sut: DeleteBillUseCase;
let account: Account;
let bill: CreateBill;

describe('Delete Bill Use Case', () => {
    beforeEach(async () => {
        accountRepository = new InMemoryAccountsRepository();
        billRepository = new InMemoryBillRepository();
        sut = new DeleteBillUseCase(billRepository);

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

    it('should be able to delete bill', async () => {
        const billCreated = await billRepository.create(bill);
        const billDeleted = await sut.execute(billCreated.id);
        const billAlreadyDeleted = await billRepository.getById(billDeleted.id);

        expect(billCreated).toBeDefined();
        expect(billCreated.accountId).toEqual(billDeleted.accountId);
        expect(billCreated.amount).toEqual(billDeleted.amount);
        expect(billAlreadyDeleted).toBeNull();
    });

    it('should not be able to delete bill if bill do not exist', async () => {
        await expect(sut.execute(fakerPT_BR.string.uuid())).rejects.toBeInstanceOf(BillNotFoundError);
    });
});