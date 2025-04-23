export class BillAlreadyPaid extends Error {
    constructor() {
        super('Bill Already Paid or deleted');
    }
}