import { PrismaAccountRepository } from '../../repositories/prisma/prisma-account-repository';
import { PrismaTransactionRepository } from '../../repositories/prisma/prisma-transaction-repository';
import { GetTransactionsSummaryByAccountIdAndYear } from '../transactions/get-transactions-summary-by-account-id-and-year.use-case';

export function getTransactionsSummaryByAccountIdAndYearFactory() {
    const transactionRepository = new PrismaTransactionRepository();
    const accountRepository = new PrismaAccountRepository();
    const getTransactionsSummaryByAccountIdAndYear = new GetTransactionsSummaryByAccountIdAndYear(transactionRepository, accountRepository);

    return getTransactionsSummaryByAccountIdAndYear;
}