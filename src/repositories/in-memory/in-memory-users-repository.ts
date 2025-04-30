import { User, UserCreateInput, UsersRepository } from '../users-repository';
import { randomUUID } from 'node:crypto';

interface UserWithPassword extends User {
  password: string;
}

export class InMemoryUsersRepository implements UsersRepository {
    public items: UserWithPassword[] = [];

    async create(data: UserCreateInput) {
        const userId = randomUUID();

        const user: UserWithPassword = {
            id: userId,
            name: data.name,
            email: data.email,
            role: 'standard',
            password: data.password,
            created_at: new Date(),
            updated_at: new Date(),
            email_already_verifyed: false,
            Account: [{
                id: randomUUID(),
                balance: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
                userId: userId
            }]
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