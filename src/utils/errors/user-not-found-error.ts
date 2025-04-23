export class UserNotFoundError extends Error {
    constructor() {
        super('User Not Found');
    }
}