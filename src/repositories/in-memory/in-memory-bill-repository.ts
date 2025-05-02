import { randomUUID } from 'node:crypto';
import { Bill, BillCreateInput, BillRepository, FindManyBillsInput } from '../bill-repository';

export class InMemoryBillRepository implements BillRepository {
    public items: Bill[] = [];

    async delete(billId: string) {
        const index = this.items.findIndex((item) => item.id === billId);
        const [deletedBill] = this.items.splice(index, 1);
        return deletedBill;
    }

    async create(data: BillCreateInput) {
        const bill: Bill = {
            name: data.name,
            id: randomUUID(),
            description: data.description ?? null,
            amount: data.amount,
            dueDay: data.dueDay,
            active: data.active,
            accountId: data.accountId,
            installments: data.installments ?? null,
            paidInstallments: data.paidInstallments,
            createdAt: new Date(),
            updatedAt: new Date(),
            billType: data.billType
        };

        this.items.push(bill);

        return bill;
    }

    async getByAccountId(data: FindManyBillsInput) {
        const bills = this.items.filter((item) => item.accountId === data.accountId).slice((data.page - 1) * data.offset, data.page * data.offset);
        const response = {
            billsCount: this.items.length,
            bills
        };
        return response;
    }

    async payInvoice(paidInstallments: number, billId: string, active: boolean): Promise<Bill> {
        const index = this.items.findIndex((item) => item.id === billId);

        if (index === -1) {
            throw new Error('Bill not found');
        }

        this.items[index] = {
            ...this.items[index],
            paidInstallments: paidInstallments + 1,
            active,
            updatedAt: new Date()
        };

        return this.items[index];
    }

    async getById(billId: string) {
        const bill = this.items.find((item) => item.id === billId);
        return bill ?? null;
    }

    async getByAccountIdInPeriod(accountId: string, startDate: Date, endDate: Date) {
        const bills = this.items.filter((item) => item.accountId === accountId && item.createdAt >= startDate && item.createdAt <= endDate);
        const response = {
            billsCount: this.items.length,
            bills
        };
        return response;
    }
}