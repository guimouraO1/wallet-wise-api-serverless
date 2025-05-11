import { PrismaAccountRepository } from '../../repositories/prisma/prisma-account-repository';
import { PrismaTransactionRepository } from '../../repositories/prisma/prisma-transaction-repository';
import { CreateTransactionUseCase } from '../transactions/create-transaction.use-case';

export function createTransactionFactory() {
    const transactionsRepository = new PrismaTransactionRepository();
    const accountRepository = new PrismaAccountRepository();

    const createTransactionUseCase = new CreateTransactionUseCase(transactionsRepository, accountRepository);

    return createTransactionUseCase;
}