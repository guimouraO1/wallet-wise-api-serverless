export class CreateUserError extends Error {
    constructor() {
        super('User creation error');
    }
}