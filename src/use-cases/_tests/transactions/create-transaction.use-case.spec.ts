import { beforeEach, it, describe, expect, afterEach } from 'vitest';
import { InMemoryAccountsRepository } from '../../../repositories/in-memory/in-memory-account-repository';
import { InMemoryTransactionRepository } from '../../../repositories/in-memory/in-memory-transaction-repository';
import { Account } from '../../../repositories/account-repository';
import { AccountNotFoundError } from '../../../utils/errors/account-not-found-error';
import { fakerPT_BR } from '@faker-js/faker';
import { PaymentMethodEnum, TransactionCreateInput, TransactionTypeEnum } from '../../../repositories/transaction-repository';
import { YouAreNotElonError } from '../../../utils/errors/elon-error';
import { CreateTransactionUseCase } from '../../transactions/create-transaction.use-case';

let accountRepository: InMemoryAccountsRepository;
let transactionRepository: InMemoryTransactionRepository;
let sut: CreateTransactionUseCase;
let account: Account;
let transaction: TransactionCreateInput;

describe('Create Transaction Use Case', () => {
    beforeEach(async () => {
        accountRepository = new InMemoryAccountsRepository();
        transactionRepository = new InMemoryTransactionRepository();
        sut = new CreateTransactionUseCase(transactionRepository, accountRepository);

        account = await accountRepository.create({ userId: fakerPT_BR.string.uuid() });
        transaction = {
            accountId: account.id,
            amount: fakerPT_BR.number.float({ min: 0.01, max: 10_000_000 }),
            name: fakerPT_BR.company.name(),
            paymentMethod: fakerPT_BR.helpers.enumValue(PaymentMethodEnum),
            type: TransactionTypeEnum.Deposit
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
        await accountRepository.update({ accountId: account.id , amount: 10_000_000_000, type: 'deposit' });
        await expect(sut.execute({ ...transaction, type: TransactionTypeEnum.Deposit })).rejects.toBeInstanceOf(YouAreNotElonError);
    });
});