import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import logger from '../../utils/libs/logger';
import { UserIdFromParam } from '../../utils/types/user/user-id-from-param';

const filename = __filename.split(/[/\\]/).pop();

export async function authorizeOwnerOrAdminByUserIdParam(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.params as UserIdFromParam;

    if (request.user.role === 'admin') {
        return;
    }

    if (request.user.sub !== userId) {
        logger.error(`${filename} -> Unauthorized access attempt detected - User ${request.user.sub}, Role ${request.user.role}`);
        return reply.status(StatusCodes.FORBIDDEN).send({ message: 'Forbidden' });
    }
}