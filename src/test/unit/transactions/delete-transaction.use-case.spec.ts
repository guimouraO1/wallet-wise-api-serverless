import { fakerPT_BR } from '@faker-js/faker';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { InMemoryAccountsRepository } from '../../../repositories/in-memory/in-memory-account-repository';
import { InMemoryTransactionRepository } from '../../../repositories/in-memory/in-memory-transaction-repository';
import { DeleteTransactionUseCase } from '../../../use-cases/transactions/delete-transaction.use-case';
import { TransactionNotFoundError } from '../../../utils/errors/transaction-not-found-error';
import { PaymentMethodEnum, TransactionTypeEnum } from '../../../utils/types/transactions/transaction';

let accountRepository: InMemoryAccountsRepository;
let transactionRepository: InMemoryTransactionRepository;
let sut: DeleteTransactionUseCase;

describe('Delete Transaction Use Case', () => {
    beforeEach(async () => {
        accountRepository = new InMemoryAccountsRepository();
        transactionRepository = new InMemoryTransactionRepository();
        sut = new DeleteTransactionUseCase(transactionRepository);
    });

    afterEach(() => {
        accountRepository.items = [];
        transactionRepository.items = [];
    });

    it('should be able to delete transaction', async () => {
        const transaction = await transactionRepository.create({
            accountId: fakerPT_BR.string.uuid(),
            amount: fakerPT_BR.number.float({ min: 0.01, max: 10_000_000 }),
            name: fakerPT_BR.company.name(),
            paymentMethod: fakerPT_BR.helpers.enumValue(PaymentMethodEnum),
            type: TransactionTypeEnum.Deposit
        });

        const transactionDeleted = await sut.execute(transaction.id);

        expect(transactionDeleted?.accountId).toEqual(transaction.accountId);
        expect(transactionDeleted?.amount).toEqual(transaction.amount);
        expect(transactionDeleted?.name).toEqual(transaction.name);
        expect(transactionDeleted?.paymentMethod).toEqual(transaction.paymentMethod);
        expect(transactionDeleted?.type).toEqual(transaction.type);
        expect(!transactionRepository.items.find((t) => t.id === transaction.id));
    });

    it('should not be able to delete transaction if transaction do not exist', async () => {
        await expect(sut.execute(fakerPT_BR.string.uuid())).rejects.toBeInstanceOf(TransactionNotFoundError);
    });
});