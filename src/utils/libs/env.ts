import 'dotenv/config';
import { z } from 'zod';

const envShema = z.object({
    NODE_ENV: z.enum(['dev', 'production', 'test']).default('dev'),
    PORT: z.coerce.number().default(3000),
    DATABASE_URL: z.string(),

    JWT_PUBLIC_KEY: z.string(),
    JWT_PRIVATE_KEY: z.string(),
    JWT_EXPIRATION_TIME: z.string().default('15m'),
    JWT_REFRESH_TOKEN_EXPIRATION_TIME: z.string().default('7d'),
    JWT_ALGORITHM: z.enum(['RS256']).default('RS256'),

    REFRESH_TOKEN_NAME: z.string().default('refreshToken'),
    COOKIE_SECRET: z.string().default('secret_test'),

    PASSWORD_HASH_ROUNDS: z.coerce.number().min(8).max(12).default(8)
});

const _env = envShema.safeParse(process.env);

if (_env.success === false) {
    console.error('Invalid environment variables.', _env.error.format());

    throw new Error('Invalid enviroment variables.');
}
// console.log(process.env);
export const env = _env.data;