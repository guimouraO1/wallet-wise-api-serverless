import { BillRepository } from '../../repositories/bill-repository';
import { BillAlreadyPaid } from '../../utils/errors/bill-already-paid-error';
import { BillNotFoundError } from '../../utils/errors/bill-not-found-error';

export class PayBillUseCase {
    constructor(private billRepository: BillRepository)  {}

    async execute(id: string) {
        const billExists = await this.billRepository.getById(id);
        if (!billExists) {
            throw new BillNotFoundError();
        }

        if (!billExists.active ||
            (billExists.installments && billExists.paidInstallments >= billExists.installments)) {
            throw new BillAlreadyPaid();
        }

        const billUpdated = await this.billRepository.payBill(billExists);
        return billUpdated;
    }
}