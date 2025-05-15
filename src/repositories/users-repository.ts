import { CreateUser } from '../utils/types/user/create-user';
import { User } from '../utils/types/user/user';

export interface UsersRepository {
    create(data: CreateUser): Promise<User>;
    getByEmail(email: string): Promise<User | null>;
    getById(id: string): Promise<User | null>;
}