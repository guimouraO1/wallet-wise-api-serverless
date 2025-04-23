export class AccountAlreadyExistsError extends Error {
    constructor() {
        super('Account Already Exists');
    }
}