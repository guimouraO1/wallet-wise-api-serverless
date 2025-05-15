import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { getAccountByUserIdFactory } from '../../../use-cases/_factories/get-account-by-user-id.factory';
import { AccountNotFoundError } from '../../../utils/errors/account-not-found-error';
import { UserNotFoundError } from '../../../utils/errors/user-not-found-error';
import logger from '../../../utils/libs/logger';
import { UserIdFromParam } from '../../../utils/types/user/user-id-from-param';

const filename = __filename.split(/[/\\]/).pop();

export async function getAccount(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.params as UserIdFromParam;
    logger.info(`${filename} -> Searching for account - User ${userId}`);

    try {
        const accountService = getAccountByUserIdFactory();
        const account = await accountService.execute(userId);
        logger.info(`${filename} -> Account found successfully - User ${userId}`);

        reply.status(StatusCodes.OK).send(account);
    } catch (error) {
        if (error instanceof UserNotFoundError) {
            logger.error(`${filename} -> Account creation failed - User Not Found - User ${userId}`);
            return reply.status(StatusCodes.NOT_FOUND).send({ message: error.message });
        }

        if (error instanceof AccountNotFoundError) {
            logger.error(`${filename} -> Account creation failed - Account not fount - User ${userId}`);
            return reply.status(StatusCodes.NOT_FOUND).send({ message: error.message });
        }

        logger.error(`${filename} -> Unexpected error during get account: ${error}`);
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Unknown error' });
    }
}
