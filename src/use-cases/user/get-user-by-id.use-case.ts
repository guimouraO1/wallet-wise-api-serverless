import { UsersRepository } from '../../repositories/users-repository';
import { UserNotFoundError } from '../../utils/errors/user-not-found-error';

export class GetUserByIdUseCase {
    constructor(private usersRepository: UsersRepository) {}

    async execute(userId: string) {
        const user = await this.usersRepository.getById(userId);

        if(!user) {
            throw new UserNotFoundError();
        }

        return user;
    }
}