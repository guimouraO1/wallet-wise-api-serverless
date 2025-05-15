import { fakerPT_BR } from '@faker-js/faker';
import { afterEach, beforeEach, describe, it } from 'vitest';
import { InMemoryBillRepository } from '../../../repositories/in-memory/in-memory-bill-repository';
import { PayBillUseCase } from '../../../use-cases/bills/pay-bill.use-case';
import { BillAlreadyPaid } from '../../../utils/errors/bill-already-paid-error';
import { BillNotFoundError } from '../../../utils/errors/bill-not-found-error';
import { Optional } from '../../../utils/optional';
import { BillFrequencyEnum, BillTypeEnum } from '../../../utils/types/bills/bill';
import { CreateBill } from '../../../utils/types/bills/create-bill';

let billRepository: InMemoryBillRepository;
let sut: PayBillUseCase;
let bill: Optional<CreateBill, 'active'>;

describe('Pay Bill Use Case', () => {
    beforeEach(async () => {
        billRepository = new InMemoryBillRepository();
        sut = new PayBillUseCase(billRepository);

        bill = {
            accountId: fakerPT_BR.string.uuid(),
            amount: +fakerPT_BR.finance.amount({ min: 1, max: 10_000 }),
            billType: fakerPT_BR.helpers.enumValue(BillTypeEnum),
            frequency: fakerPT_BR.helpers.enumValue(BillFrequencyEnum),
            name: fakerPT_BR.company.name(),
            paidInstallments: fakerPT_BR.number.int({ min: 1, max: 20 }),
            installments: fakerPT_BR.number.int({ min: 20, max: 40 }),
            description: fakerPT_BR.finance.transactionDescription(),
            dueDay: fakerPT_BR.number.int({ min: 1, max: 26 })
        };
    });

    afterEach(() => {
        billRepository.items = [];
    });

    it('should be able to pay bill', async () => {
        const billCreated = await billRepository.create(bill);
        const billPayd = await sut.execute(billCreated.id);

        expect(billPayd).toBeTypeOf('object');
        expect(billPayd.active).toBeTruthy();
        expect(billPayd.amount).toEqual(bill.amount);
        expect(billPayd.name).toEqual(bill.name);
        expect(billPayd.description).toEqual(bill.description);
    });

    it('should be able to settle the bill', async () => {
        const billCreated = await billRepository.create({ ...bill, installments: 4, paidInstallments: 3, billType: BillTypeEnum.Installment });
        const billPayd = await sut.execute(billCreated.id);
        expect(billPayd).toBeTypeOf('object');
        expect(billPayd.active).toBeFalsy();
        expect(billPayd.amount).toEqual(bill.amount);
        expect(billPayd.name).toEqual(bill.name);
        expect(billPayd.description).toEqual(bill.description);
    });

    it('should not be able to pay bill if bill do not exist', async () => {
        await expect(sut.execute(fakerPT_BR.string.uuid())).rejects.toBeInstanceOf(BillNotFoundError);
    });

    it('should be able to settle the bill', async () => {
        const billCreated = await billRepository.create({ ...bill, installments: 4, paidInstallments: 3, billType: BillTypeEnum.Installment });
        await sut.execute(billCreated.id);
        await expect(sut.execute(billCreated.id)).rejects.toBeInstanceOf(BillAlreadyPaid);
    });
});