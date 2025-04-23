type BillType = 'recurring' | 'installment'
type BillFrequency = 'monthly' | 'weekly' | 'annual'

export type BillCreateInput = {
    name: string;
    description?: string | null;
    amount: number;
    billType: BillType;
    dueDay?: number | null;
    frequency: BillFrequency;
    installments?: number | null;
    paidInstallments: number;
    active: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    accountId: string;
};

export type Bill = {
    name: string;
    id: string;
    description: string | null;
    amount: number;
    billType: BillType;
    dueDay?: number | null;
    frequency?: BillFrequency | null;
    active: boolean;
    accountId: string;
    installments: number | null;
    paidInstallments: number | null;
    createdAt: Date;
    updatedAt: Date;
}

export type FindManyBillsInput = {
    name?: string;
    active?: boolean;
    billType?: BillType;
    frequency?: BillFrequency;
    accountId: string;
    page: number;
    offset: number;
}

export type FindManyBillsInputString = {
    name?: string;
    active?: string;
    billType?: BillType;
    frequency?: BillFrequency;
    accountId: string;
    page: number;
    offset: number;
}

export type FindManyBillsResponse = {
    billsCount: number;
    bills: Bill[]
}

export interface BillRepository {
    create(data: BillCreateInput): Promise<Bill>;
    findManyByAccountId(data: FindManyBillsInput): Promise<FindManyBillsResponse>;
    delete(billId: string): Promise<Bill>;
    payInvoice(paidInstallments: number, billId: string, active: boolean): Promise<Bill>;
    findUnique(billId: string): Promise<Bill | null>;
}