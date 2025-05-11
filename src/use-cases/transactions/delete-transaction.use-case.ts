import { TransactionRepository } from '../../repositories/transaction-repository';
import { TransactionNotFoundError } from '../../utils/errors/transaction-not-found-error';

export class DeleteTransactionUseCase {
    constructor(private transactionRepository: TransactionRepository)  {}

    async execute(transactionId: string) {
        const transactionExists = await this.transactionRepository.getById(transactionId);
        if (!transactionExists) {
            throw new TransactionNotFoundError();
        }

        const transaction = await this.transactionRepository.delete(transactionId);
        return transaction;
    }
}