import { randomUUID } from 'node:crypto';
import { Bill, BillTypeEnum } from '../../utils/types/bills/bill';
import { CreateBill } from '../../utils/types/bills/create-bill';
import { BillRepository, FindManyBillsInput } from '../bill-repository';

export class InMemoryBillRepository implements BillRepository {
    public items: Bill[] = [];

    async delete(billId: string) {
        const index = this.items.findIndex((item) => item.id === billId);
        const [deletedBill] = this.items.splice(index, 1);
        return deletedBill;
    }

    async create(data: CreateBill) {
        const bill: Bill = {
            frequency: data.frequency ?? null,
            name: data.name,
            id: randomUUID(),
            description: data.description ?? null,
            amount: data.amount,
            dueDay: data.dueDay,
            active: data.active ?? true,
            accountId: data.accountId,
            installments: data.installments ?? null,
            paidInstallments: data.paidInstallments,
            createdAt: data.createdAt as Date ?? new Date(),
            updatedAt: data.updatedAt as Date ?? new Date(),
            billType: data.billType,
            deleted: false
        };

        this.items.push(bill);

        return bill;
    }

    async getByAccountId(data: FindManyBillsInput) {
        const filtered = this.items.filter((item) => {
            const matchesAccount = item.accountId === data.accountId;
            const matchesBillType = data.billType ? item.billType === data.billType : true;
            const matchesActive = typeof data.active === 'boolean' ? item.active === data.active : true;
            const matchesFrequency = data.frequency ? item.frequency === data.frequency : true;
            const matchesName = data.name ? item.name.toLowerCase().includes(data.name.toLowerCase()) : true;

            return matchesAccount && matchesBillType && matchesActive && matchesFrequency && matchesName;
        });

        const bills = filtered.slice((data.page - 1) * data.offset, data.page * data.offset);

        const response = {
            billsCount: filtered.length,
            bills
        };

        return response;
    }

    async payBill(bill: Bill): Promise<Bill> {
        const index = this.items.findIndex((item) => item.id === bill.id);

        const currentBill = this.items[index];
        const updatedPaidInstallments = currentBill.paidInstallments + 1;
        const isInstallmentPaidOff = currentBill.billType === BillTypeEnum.Installment &&
        updatedPaidInstallments >= (currentBill.installments ?? 0);

        const updatedBill: Bill = {
            ...currentBill,
            paidInstallments: updatedPaidInstallments,
            active: !isInstallmentPaidOff,
            updatedAt: new Date()
        };

        this.items[index] = updatedBill;

        return updatedBill;
    }

    async getById(billId: string) {
        const bill = this.items.find((item) => item.id === billId);
        return bill ?? null;
    }

    async getByAccountIdInPeriod(accountId: string, startDate: Date, endDate: Date) {
        const bills = this.items.filter((item) => {
            const matchesAccount = item.accountId === accountId;
            const inPeriod = item.createdAt >= startDate && item.createdAt <= endDate;

            return matchesAccount && inPeriod;
        });

        const response = {
            billsCount: bills.length,
            bills
        };

        return response;
    }
}