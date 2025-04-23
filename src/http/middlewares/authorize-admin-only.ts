import { FastifyRequest, FastifyReply } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import logger from '../../utils/lib/logger';

const filename = __filename.split(/[/\\]/).pop();

export async function authorizeAdminOnly(request: FastifyRequest, reply: FastifyReply) {
    if (request.user.role !== 'admin') {
        logger.error(`${filename} -> Unauthorized access attempt detected. - User ${request.user.sub}, Role ${request.user.role}`);
        return reply.status(StatusCodes.FORBIDDEN).send({ message: 'Forbidden' });
    }
}