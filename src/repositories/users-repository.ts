import { Optional } from '../utils/optional';
import { Account } from './account-repository';

type Role = 'admin' | 'standard';

export type User = {
    name: string;
    id: string;
    email: string;
    role: Role;
    created_at: Date;
    updated_at: Date;
    avatarUrl?: string;
    email_already_verifyed: boolean;
    password: string;
    Account: Account[]
};

export type UserCreateInput = Pick<User, 'name' | 'email' | 'password' | 'avatarUrl'>;

export interface UsersRepository {
    create(data: UserCreateInput): Promise<Optional<User, 'Account'>>;
    getByEmail(email: string): Promise<Optional<User, 'Account'> | null>;
    getById(id: string): Promise<Optional<User, 'password'> | null>
}