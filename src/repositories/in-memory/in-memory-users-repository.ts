import { randomUUID } from 'node:crypto';
import { CreateUser } from '../../utils/types/user/create-user';
import { User } from '../../utils/types/user/user';
import { UsersRepository } from '../users-repository';

export class InMemoryUsersRepository implements UsersRepository {
    public items: User[] = [];

    async create(data: CreateUser) {
        const user: User = {
            id: randomUUID(),
            name: data.name,
            email: data.email,
            role: 'standard',
            ...(data.avatarUrl ? { avatarUrl: data.avatarUrl } : {}),
            created_at: new Date(),
            updated_at: new Date(),
            password: data.password,
            email_already_verifyed: false,
            Account: []
        };

        this.items.push(user);
        return user;
    }

    async getByEmail(email: string) {
        const user = this.items.find((item) => item.email === email);
        return user ?? null;
    }

    async getById(id: string) {
        const user = this.items.find((item) => item.id === id);
        return user ?? null;
    }
}