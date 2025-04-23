import { PrismaAccountRepository } from '@/repositories/prisma/prisma-account-repository';
import { PrismaBillRepository } from '@/repositories/prisma/prisma-bill-repository';
import { BillService } from '../bill.service';
import { PrismaTransactionRepository } from '@/repositories/prisma/prisma-transaction-repository';

export function BillFactory() {
    const billRepository = new PrismaBillRepository();
    const accountRepository = new PrismaAccountRepository();
    const transactionRepository = new PrismaTransactionRepository();

    const billService = new BillService(billRepository, accountRepository, transactionRepository);

    return billService;
}