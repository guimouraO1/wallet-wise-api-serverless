import { FastifyRequest, FastifyReply } from 'fastify';
import { userFactory } from '../../../services/factories/user.factory';
import { StatusCodes } from 'http-status-codes';
import logger from '../../../utils/lib/logger';
import { UserNotFoundError } from '../../../utils/errors/user-not-found-error';
import { UserIdParamZod } from '../../../utils/schemas/user-id-param';

const filename = __filename.split(/[/\\]/).pop();

export async function getUserById(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.params as UserIdParamZod;
    logger.info(`${filename} -> Initiating find user by id: ${userId} - User ${request.user.sub}, Role: ${request.user.role}`);

    try {
        const userService = userFactory();
        const user = await userService.getUserById(userId);
        logger.info(`${filename} -> User finded id: ${userId} - User ${request.user.sub}, Role: ${request.user.role}`);

        reply.status(StatusCodes.OK).send(user);
    } catch (error) {
        if (error instanceof UserNotFoundError) {
            logger.error(`${filename} -> User not found - User ${request.user.sub}, Role: ${request.user.role}`);
            return reply.status(StatusCodes.NOT_FOUND).send({ message: error.message });
        }

        logger.error(`${filename} -> Unexpected error during find user by id: ${error}`);
        throw error;
    }
}
