import { FastifyRequest, FastifyReply } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import logger from '../../utils/libs/logger';

const filename = __filename.split(/[/\\]/).pop();

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        logger.error(`${filename} -> Authorization header missing or malformed.`);
        return reply.status(StatusCodes.UNAUTHORIZED).send({ message: 'Authorization header missing or malformed' });
    }

    const token: any = authHeader.split(' ')[1];
    if (!token) {
        logger.error(`${filename} -> Authorization header missing.`);
        return reply.status(StatusCodes.UNAUTHORIZED).send({ message: 'Unauthorized' });
    }

    try {
        await request.jwtVerify(token);
    } catch {
        logger.error(`${filename} -> Unauthorized.`);
        return reply.status(StatusCodes.UNAUTHORIZED).send({ message: 'Unauthorized' });
    }
}