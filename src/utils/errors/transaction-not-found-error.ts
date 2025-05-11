export class TransactionNotFoundError extends Error {
    constructor() {
        super('Transaction Not Found');
    }
}