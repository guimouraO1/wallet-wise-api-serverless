import { FastifyRequest, FastifyReply } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import logger from '@/utils/lib/logger';
import { AccountNotFoundError } from '@/utils/errors/account-not-found-error';
import { userFactory } from '@/services/factories/user.factory';

const filename = __filename.split(/[/\\]/).pop();

export async function authorizeOwnerOrAdminByAccountIdBody(request: FastifyRequest, reply: FastifyReply) {
    const data = request.body as { accountId: string };

    if (request.user.role === 'admin') {
        return;
    }

    try {
        const userService = userFactory();
        const user = await userService.getUserById(request.user.sub);
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
        throw error;
    }
}
