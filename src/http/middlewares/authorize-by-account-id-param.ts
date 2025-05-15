
import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { getUserByIdFactory } from '../../use-cases/_factories/get-user-by-id.factory';
import { AccountNotFoundError } from '../../utils/errors/account-not-found-error';
import logger from '../../utils/libs/logger';
import { AccountIdFromParam } from '../../utils/types/account/account-id-from-param';

const filename = __filename.split(/[/\\]/).pop();

export async function authorizeOwnerOrAdminByAccountIdParam(request: FastifyRequest, reply: FastifyReply) {
    const data = request.params as AccountIdFromParam;

    if (request.user.role === 'admin') {
        return;
    }

    try {
        const userService = getUserByIdFactory();
        const user = await userService.execute(request.user.sub);
        if (!user) {
            logger.error(`${filename} -> User not found - User ${request.user.sub}, Role ${request.user.role}`);
            return reply.status(StatusCodes.NOT_FOUND).send({ message: 'Not found' });
        }

        const isAccountOwner = user.Account.some((account) => account.id === data.accountId);
        if (!isAccountOwner) {
            logger.error(`${filename} -> Unauthorized access attempt detected. - User ${request.user.sub}, Role ${request.user.role}`);
            return reply.status(StatusCodes.FORBIDDEN).send({ message: 'Forbidden' });
        }

    } catch (error) {
        if (error instanceof AccountNotFoundError) {
            logger.error(`${filename} -> Account not found for user ${request.user.sub}`);
            return reply.status(StatusCodes.NOT_FOUND).send({ message: error.message });
        }

        logger.error(`${filename} -> Unexpected error during find many paginated transactions: ${error}`);
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Unknown error' });
    }
}
