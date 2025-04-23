import { Account } from './account-repository';

type Role = 'admin' | 'standard';

export type User = {
    Account: Account[];
    name: string;
    id: string;
    email: string;
    role: Role;
    created_at: Date;
    updated_at: Date;
    avatarUrl?: string | null | undefined;
    email_already_verifyed: boolean;
};

export interface UserWithPassword extends User {
    password: string;
}

export type UserCreateInput = {
    name: string;
    email: string;
    password: string;
    avatarUrl?: string | null;
};

export interface UsersRepository {
    create(data: UserCreateInput): Promise<User>;
    findByEmail(email: string): Promise<UserWithPassword | null>;
    findById(id: string): Promise<User | null>;
}