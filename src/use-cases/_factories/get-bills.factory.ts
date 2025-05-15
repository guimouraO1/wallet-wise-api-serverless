import { PrismaAccountRepository } from '../../repositories/prisma/prisma-account-repository';
import { PrismaBillRepository } from '../../repositories/prisma/prisma-bill-repository';
import { GetBillsUseCase } from '../bills/get-bills.use-case';

export function getBillsFactory() {
    const billsRepository = new PrismaBillRepository();
    const accountRepository = new PrismaAccountRepository();
    const getBillsUseCase = new GetBillsUseCase(billsRepository, accountRepository);

    return getBillsUseCase;
}