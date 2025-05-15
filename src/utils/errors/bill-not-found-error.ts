export class BillNotFoundError extends Error {
    constructor() {
        super('Bill Not Found');
    }
}