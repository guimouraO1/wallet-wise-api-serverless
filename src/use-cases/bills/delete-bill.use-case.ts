import { BillRepository } from '../../repositories/bill-repository';
import { BillNotFoundError } from '../../utils/errors/bill-not-found-error';

export class DeleteBillUseCase {
    constructor(private billRepository: BillRepository)  {}

    async execute(billId: string) {
        const billExists = await this.billRepository.getById(billId);
        if (!billExists) {
            throw new BillNotFoundError();
        }

        const bill = await this.billRepository.delete(billId);
        return bill;
    }
}