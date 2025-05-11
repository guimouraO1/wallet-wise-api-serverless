import { PrismaAccountRepository } from '../../repositories/prisma/prisma-account-repository';
import { GetTransactionsInPeriodUseCase } from '../../use-cases/transactions/get-transactions-in-period.use-case';
import { PrismaTransactionRepository } from '../../repositories/prisma/prisma-transaction-repository';

export function getTransactionsInPeriodFactory() {
    const transactionRepository = new PrismaTransactionRepository();
    const accountRepository = new PrismaAccountRepository();
    const getTransactionsInPeriodUseCase = new GetTransactionsInPeriodUseCase(transactionRepository, accountRepository);

    return getTransactionsInPeriodUseCase;
}