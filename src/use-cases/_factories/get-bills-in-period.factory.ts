import { PrismaAccountRepository } from '../../repositories/prisma/prisma-account-repository';
import { PrismaBillRepository } from '../../repositories/prisma/prisma-bill-repository';
import { GetBillsInPeriodUseCase } from '../bills/get-bills-in-period.use-case';

export function getBillsInPeriodFactory() {
    const billsRepository = new PrismaBillRepository();
    const accountRepository = new PrismaAccountRepository();
    const getBillsInPeriodUseCase = new GetBillsInPeriodUseCase(billsRepository, accountRepository);

    return getBillsInPeriodUseCase;
}