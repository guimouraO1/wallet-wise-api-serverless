import { PrismaAccountRepository } from '../../repositories/prisma/prisma-account-repository';
import { PrismaTransactionRepository } from '../../repositories/prisma/prisma-transaction-repository';
import { GetTransactionsSummaryUseCase } from '../transactions/get-transactions-summary.use-case';

export function getTransactionsSummaryFactory() {
    const transactionRepository = new PrismaTransactionRepository();
    const accountRepository = new PrismaAccountRepository();
    const getTransactionsSummary = new GetTransactionsSummaryUseCase(transactionRepository, accountRepository);

    return getTransactionsSummary;
}