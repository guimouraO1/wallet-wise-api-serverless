import { PrismaAccountRepository } from '../../repositories/prisma/prisma-account-repository';
import { PrismaTransactionRepository } from '../../repositories/prisma/prisma-transaction-repository';
import { GetTransactionsUseCase } from '../transactions/get-transactions.use-case';

export function getTransactionsFactory() {
    const transactionRepository = new PrismaTransactionRepository();
    const accountRepository = new PrismaAccountRepository();
    const getTransactions = new GetTransactionsUseCase(transactionRepository, accountRepository);

    return getTransactions;
}