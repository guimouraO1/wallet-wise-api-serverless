import { PrismaBillRepository } from '../../repositories/prisma/prisma-bill-repository';
import { DeleteBillUseCase } from '../bills/delete-bill.use-case';

export function deleteBillFactory() {
    const billsRepository = new PrismaBillRepository();
    const deleteBillUseCase = new DeleteBillUseCase(billsRepository);

    return deleteBillUseCase;
}