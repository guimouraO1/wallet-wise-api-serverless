import { fakerPT_BR } from '@faker-js/faker';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { InMemoryAccountsRepository } from '../../../repositories/in-memory/in-memory-account-repository';
import { InMemoryTransactionRepository } from '../../../repositories/in-memory/in-memory-transaction-repository';
import { CreateTransactionUseCase } from '../../../use-cases/transactions/create-transaction.use-case';
import { AccountNotFoundError } from '../../../utils/errors/account-not-found-error';
import { YouAreNotElonError } from '../../../utils/errors/elon-error';
import { Account } from '../../../utils/types/account/account';
import { CreateTransaction } from '../../../utils/types/transactions/create-transaction';
import { PaymentMethodEnum, TransactionTypeEnum } from '../../../utils/types/transactions/transaction';

let accountRepository: InMemoryAccountsRepository;
let transactionRepository: InMemoryTransactionRepository;
let sut: CreateTransactionUseCase;
let account: Account;
let transaction: CreateTransaction;

describe('Create Transaction Use Case', () => {
    beforeEach(async () => {
        accountRepository = new InMemoryAccountsRepository();
        transactionRepository = new InMemoryTransactionRepository();
        sut = new CreateTransactionUseCase(transactionRepository, accountRepository);

        account = await accountRepository.create(fakerPT_BR.string.uuid());
        transaction = {
            accountId: account.id,
            amount: fakerPT_BR.number.float({ min: 0.01, max: 10_000_000 }),
            name: fakerPT_BR.company.name(),
            paymentMethod: fakerPT_BR.helpers.enumValue(PaymentMethodEnum),
            type: fakerPT_BR.helpers.enumValue(TransactionTypeEnum)
        };
    });

    afterEach(() => {
        accountRepository.items = [];
        transactionRepository.items = [];
    });

    it('should be able to create transaction', async () => {
        const transactionCreated = await sut.execute(transaction);

        expect(transactionCreated.accountId).toEqual(transaction.accountId);
        expect(transactionCreated.amount).toEqual(transaction.amount);
        expect(transactionCreated.name).toEqual(transaction.name);
        expect(transactionCreated.paymentMethod).toEqual(transaction.paymentMethod);
        expect(transactionCreated.type).toEqual(transaction.type);
    });

    it('should not be able to create transaction if account do not exist', async () => {
        await expect(sut.execute({ ...transaction, accountId: fakerPT_BR.string.uuid() })).rejects.toBeInstanceOf(AccountNotFoundError);
    });

    it('should not be able to create transaction if account money is more than 10_000_000_000', async () => {
        await accountRepository.update({ accountId: account.id , balance: 10_000_000_000, type: 'deposit' });
        await expect(sut.execute({ ...transaction, type: TransactionTypeEnum.Deposit })).rejects.toBeInstanceOf(YouAreNotElonError);
    });
});