import { fakerPT_BR } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import 'dotenv/config';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import app from '../../app';

const prisma = new PrismaClient();

beforeAll(async () => {
    await app.ready();
});

afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
});

describe('Create User (E2E)', () => {
    test('should be able to create user if you are admin', async () => {
        const user = {
            email: fakerPT_BR.internet.email(),
            name: fakerPT_BR.person.fullName(),
            password: fakerPT_BR.internet.password()
        };

        const user2 = {
            email: fakerPT_BR.internet.email(),
            name: fakerPT_BR.person.fullName(),
            password: fakerPT_BR.internet.password()
        };

        await prisma.user.create({
            data: {
                email: user.email,
                name: user.name,
                password: await hash(user.password, Number(process.env.PASSWORD_HASH_ROUNDS ?? 8)),
                role: 'admin'
            }
        });

        const response: any = await app.inject({
            method: 'POST',
            url: '/sign-in',
            payload: {
                email: user.email,
                password: user.password
            }
        });

        const body = JSON.parse(response.payload);
        const createUserResponse = await app.inject({
            method: 'POST',
            url: '/user',
            headers: {
                authorization: `Bearer ${body.token}`
            },
            payload: {
                email: user2.email,
                name: user2.name,
                password: user2.password
            }
        });

        const userWasCreated = await prisma.user.findUnique({ where: { email: user2.email } });

        expect(createUserResponse.statusCode).toBe(201);
        expect(!!userWasCreated).toBeTruthy();
    });
});