export class AccountNotFoundError extends Error {
    constructor() {
        super('Account Not Found');
    }
}