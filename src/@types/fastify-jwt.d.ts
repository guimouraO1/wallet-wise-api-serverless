import '@fastify/jwt';
import { Role } from '@prisma/client';

declare module '@fastify/jwt' {
    export interface FastifyJWT {
        user: {
            sub: string;
            role: Role;
        };
    }
}