import { FastifyRequest, FastifyReply } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import logger from '@/utils/lib/logger';
import { UserIdParamZod } from '@/utils/schemas/user-id-param';

const filename = __filename.split(/[/\\]/).pop();

export async function authorizeOwnerOrAdminByUserIdParam(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.params as UserIdParamZod;

    if (request.user.role === 'admin') {
        return;
    }

    if (request.user.sub !== userId) {
        logger.error(`${filename} -> Unauthorized access attempt detected - User ${request.user.sub}, Role ${request.user.role}`);
        return reply.status(StatusCodes.FORBIDDEN).send({ message: 'Forbidden' });
    }
}