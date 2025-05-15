import { PrismaAccountRepository } from '../../repositories/prisma/prisma-account-repository';
import { PrismaBillRepository } from '../../repositories/prisma/prisma-bill-repository';
import { CreateBillUseCase } from '../bills/create-bill.use-case';

export function createBillFactory() {
    const billsRepository = new PrismaBillRepository();
    const accountRepository = new PrismaAccountRepository();
    const createBillUseCase = new CreateBillUseCase(billsRepository, accountRepository);

    return createBillUseCase;
}