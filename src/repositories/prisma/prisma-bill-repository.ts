import { prisma } from '../../utils/lib/prisma';
import { BillCreateInput, BillRepository, FindManyBillsInput, FindManyBillsResponse } from '../bill-repository';

export class PrismaBillRepository implements BillRepository {
    async delete(billId: string) {
        const bill = await prisma.bill.update({
            where: {
                id: billId
            },
            data: {
                deleted: true
            }
        });

        return bill;
    }

    async create(data: BillCreateInput) {
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

    async payInvoice(paidInstallments: number, billId: string, active: boolean) {
        const bill = await prisma.bill.update({
            where: {
                id: billId
            },
            data: {
                updatedAt: new Date(),
                paidInstallments: paidInstallments + 1,
                active
            }
        });

        return bill;
    }

    async getById(billId: string) {
        const bill = await prisma.bill.findUnique({
            where: {
                id: billId
            }
        });

        return bill;
    }
}