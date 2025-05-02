import { AccountRepository } from '../repositories/account-repository';
import { Bill, BillCreateInput, BillRepository, FindManyBillsInput, FindManyBillsResponse } from '../repositories/bill-repository';
import { AccountNotFoundError } from '../utils/errors/account-not-found-error';
import { NotFoundError } from '../utils/errors/not-found-error';
import { BillAlreadyPaid } from '../utils/errors/bill-already-paid-error';
import { TransactionRepository } from '../repositories/transaction-repository';
import { DateTime } from 'luxon';
import { TIMEZONE } from '../utils/constants/timezone';

export class BillService {
    constructor(private billRepository: BillRepository, private accountRepository: AccountRepository, private transactionRepository: TransactionRepository)  {}

    async create(data: BillCreateInput): Promise<Bill> {
        const accountExists = await this.accountRepository.getByAccountId(data.accountId);
        if (!accountExists) {
            throw new AccountNotFoundError();
        }

        const bill = await this.billRepository.create(data);
        return bill;
    }

    async getByAccountId(data: FindManyBillsInput): Promise<FindManyBillsResponse> {
        const accountExists = await this.accountRepository.getByAccountId(data.accountId);
        if (!accountExists) {
            throw new AccountNotFoundError();
        }

        const bills = await this.billRepository.getByAccountId(data);
        return bills;
    }

    async getByAccountIdInPeriod(accountId: string, startDate: string, endDate: string): Promise<FindManyBillsResponse> {
        const accountExists = await this.accountRepository.getByAccountId(accountId);
        if (!accountExists) {
            throw new AccountNotFoundError();
        }

        const startDateFormated = DateTime.fromFormat(startDate, 'dd-MM-yyyy', { zone: TIMEZONE }).endOf('day').toJSDate();
        const endDateFormated = DateTime.fromFormat(endDate, 'dd-MM-yyyy', { zone: TIMEZONE }).endOf('day').toJSDate();

        const bills = await this.billRepository.getByAccountIdInPeriod(accountId, startDateFormated, endDateFormated);
        return bills;
    }

    async delete(billId: string) {
        const bill = await this.billRepository.delete(billId);
        return bill;
    }

    async payInvoice(accountId: string, billId: string) {
        const accountExists = await this.accountRepository.getByAccountId(accountId);
        if (!accountExists) {
            throw new AccountNotFoundError();
        }

        const bill = await this.billRepository.getById(billId);
        if (!bill) {
            throw new NotFoundError();
        }

        if (!bill.active || (bill.installments && bill.paidInstallments && bill.paidInstallments >= bill.installments)) {
            throw new BillAlreadyPaid();
        }

        if (bill.installments && bill.paidInstallments === (bill.installments - 1)) {
            await this.accountRepository.update({ accountId, amount: bill.amount, type: 'withdraw' });
            await this.transactionRepository.create({
                accountId,
                name: bill.name,
                description: bill.description,
                amount: bill.amount,
                type: 'withdraw',
                paymentMethod: 'other'
            });
            const billUpdated = await this.billRepository.payInvoice(bill.paidInstallments, billId, false);
            return billUpdated;
        }

        await this.accountRepository.update({ accountId, amount: bill.amount, type: 'withdraw' });
        await this.transactionRepository.create({
            accountId,
            name: bill.name ?? '',
            description: bill.description ?? '',
            amount: bill.amount,
            type: 'withdraw',
            paymentMethod: 'other'
        });
        const billUpdated = await this.billRepository.payInvoice(bill.paidInstallments ?? 0, billId, true);
        return billUpdated;
    }
}