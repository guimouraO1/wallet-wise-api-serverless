import { PrismaBillRepository } from '../../repositories/prisma/prisma-bill-repository';
import { PayBillUseCase } from '../bills/pay-bill.use-case';

export function payBillFactory() {
    const billsRepository = new PrismaBillRepository();
    const payBillUseCase = new PayBillUseCase(billsRepository);

    return payBillUseCase;
}