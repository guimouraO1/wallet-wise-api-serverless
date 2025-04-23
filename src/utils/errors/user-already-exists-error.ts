export class UserAlreadyExistsError extends Error {
    constructor() {
        super('User Already Exists');
    }
}