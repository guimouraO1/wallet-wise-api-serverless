import { prisma } from '../../utils/libs/prisma';
import { Bill } from '../../utils/types/bills/bill';
import { CreateBill } from '../../utils/types/bills/create-bill';
import { BillRepository, BillTypeEnum, FindManyBillsInput, FindManyBillsResponse } from '../bill-repository';

export class PrismaBillRepository implements BillRepository {
    async delete(id: string) {
        const bill = await prisma.bill.update({ where: { id }, data: { deleted: true, active: false } });
        return bill;
    }

    async create(data: CreateBill) {
        const bill = await prisma.bill.create({ data });
        return bill;
    }

    async getByAccountId(data: FindManyBillsInput) {
        const whereClause = {
            accountId: data.accountId,
            deleted: false,
            ...(Object.prototype.hasOwnProperty.call(data, 'active') ? { active: data.active } : { active: true }),
            ...(data.billType ? { billType: data.billType } : {}),
            ...(data.frequency ? { frequency: data.frequency } : {}),
            ...(data.name ? { name: { contains: data.name, mode: 'insensitive' as const } } : {})
        };

        const bills = await prisma.bill.findMany({
            where: whereClause,
            skip: (data.page - 1) * data.offset,
            take: data.offset,

            orderBy: {
                createdAt: 'desc'
            }
        });

        const count = await prisma.bill.count({
            where: whereClause
        });

        const response: FindManyBillsResponse = {
            billsCount: count,
            bills
        };

        return response;
    }

    async payBill(bill: Bill) {
        const result = await prisma.$transaction(async (prisma) => {
            const billUpdated = await prisma.bill.update({
                where: { id: bill.id },
                data: {
                    updatedAt: new Date(),
                    paidInstallments: bill.paidInstallments + 1,
                    active: bill.billType === BillTypeEnum.Installment && (bill.paidInstallments + 1 >= (bill.installments ?? 0)) ? false : true
                }
            });

            await prisma.transaction.create({
                data: {
                    amount: bill.amount,
                    name: bill.name,
                    paymentMethod: 'other',
                    type: 'withdraw',
                    accountId: bill.accountId,
                    description: bill.description
                }
            });

            await prisma.account.update({
                data: { balance: { decrement: bill.amount } },
                where: { id: bill.accountId }
            });

            return billUpdated;
        });

        return result;
    }

    async getById(billId: string) {
        const bill = await prisma.bill.findUnique({
            where: {
                id: billId
            }
        });

        return bill;
    }

    async getByAccountIdInPeriod(accountId: string, startDate: Date, endDate: Date) {
        const whereClause = {
            accountId,
            deleted: false,
            createdAt: {
                gte: startDate,
                lte: endDate
            }
        };

        const bills: Bill[] = await prisma.bill.findMany({
            where: whereClause,
            orderBy: {
                createdAt: 'desc'
            }
        });

        const count = await prisma.bill.count({
            where: whereClause
        });

        const response: FindManyBillsResponse = {
            billsCount: count,
            bills
        };

        return response;
    }
}