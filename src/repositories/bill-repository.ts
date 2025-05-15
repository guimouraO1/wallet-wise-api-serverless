import { Bill } from '../utils/types/bills/bill';
import { CreateBill } from '../utils/types/bills/create-bill';

type BillType = 'recurring' | 'installment'
type BillFrequency = 'monthly' | 'weekly' | 'annual'

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
    create(data: CreateBill): Promise<Bill>;
    getByAccountId(data: FindManyBillsInput): Promise<FindManyBillsResponse>;
    getByAccountIdInPeriod(accountId: string, startDate: Date, endDate: Date): Promise<FindManyBillsResponse>;
    delete(id: string): Promise<Bill>;
    payBill(bill: Bill): Promise<Bill>;
    getById(billId: string): Promise<Bill | null>;
}