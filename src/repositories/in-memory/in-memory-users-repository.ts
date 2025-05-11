import { genSalt, hash } from 'bcryptjs';
import { User, UserCreateInput, UsersRepository } from '../users-repository';
import { randomUUID } from 'node:crypto';
import { Optional } from '../../utils/optional';
import { env } from '../../utils/libs/env';

export class InMemoryUsersRepository implements UsersRepository {
    public items: Optional<User, 'Account' | 'password' >[] = [];

    async create(data: UserCreateInput) {
        const salt = await genSalt(env.PASSWORD_HASH_ROUNDS);
        const password_hash = await hash(data.password, salt);

        const user: Optional<User, 'Account'> = {
            id: randomUUID(),
            name: data.name,
            email: data.email,
            role: 'standard',
            ...(data.avatarUrl ? { avatarUrl: data.avatarUrl } : {}),
            created_at: new Date(),
            updated_at: new Date(),
            password: password_hash,
            email_already_verifyed: false
        };

        this.items.push(user);
        return user;
    }

    async getByEmail(email: string) {
        const user = this.items.find((item) => item.email === email);
        return user as User ?? null;
    }

    async getById(id: string) {
        const user = this.items.find((item) => item.id === id);
        return user as User ?? null;
    }
}