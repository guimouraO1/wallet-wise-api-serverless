import { PrismaAccountRepository } from '../../repositories/prisma/prisma-account-repository';
import { TransactionService } from '../transaction.service';
import { PrismaTransactionRepository } from '../../repositories/prisma/prisma-transaction-repository';

export function transactionFactory() {
    const transactionRepository = new PrismaTransactionRepository();
    const accountRepository = new PrismaAccountRepository();
    const transactionService = new TransactionService(transactionRepository, accountRepository);

    return transactionService;
}