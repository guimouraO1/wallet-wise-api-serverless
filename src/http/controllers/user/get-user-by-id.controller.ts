import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { getUserByIdFactory } from '../../../use-cases/_factories/get-user-by-id.factory';
import { UserNotFoundError } from '../../../utils/errors/user-not-found-error';
import logger from '../../../utils/libs/logger';
import { UserIdFromParam } from '../../../utils/types/user/user-id-from-param';

const filename = __filename.split(/[/\\]/).pop();

export async function getUserById(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.params as UserIdFromParam;
    logger.info(`${filename} -> Initiating find user by id: ${userId} - User ${request.user.sub}`);

    try {
        const userService = getUserByIdFactory();
        const user = await userService.execute(userId);
        logger.info(`${filename} -> User finded id: ${userId} - User ${request.user.sub}`);

        reply.status(StatusCodes.OK).send(user);
    } catch (error) {
        if (error instanceof UserNotFoundError) {
            logger.error(`${filename} -> User not found - User ${request.user.sub}`);
            return reply.status(StatusCodes.NOT_FOUND).send({ message: error.message });
        }

        logger.error(`${filename} -> Unexpected error during find user by id: ${error}`);
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Unknown error' });
    }
}
