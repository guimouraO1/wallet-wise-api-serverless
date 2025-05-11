import { PrismaTransactionRepository } from '../../repositories/prisma/prisma-transaction-repository';
import { DeleteTransactionUseCase } from '../transactions/delete-transaction.use-case';

export function deleteTransactionFactory() {
    const transactionsRepository = new PrismaTransactionRepository();
    const deleteTransactionUseCase = new DeleteTransactionUseCase(transactionsRepository);

    return deleteTransactionUseCase;
}