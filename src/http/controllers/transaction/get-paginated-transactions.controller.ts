import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { getTransactionsFactory } from '../../../use-cases/_factories/get-transactions.factory';
import { AccountNotFoundError } from '../../../utils/errors/account-not-found-error';
import logger from '../../../utils/libs/logger';
import { AccountIdFromParam } from '../../../utils/types/account/account-id-from-param';
import { GetPaginatedTransactions } from '../../../utils/types/transactions/get-paginated-transactions';

const filename = __filename.split(/[/\\]/).pop();

export async function getPaginatedTransactions(request: FastifyRequest, reply: FastifyReply) {
    logger.info(`${filename} -> Get paginated transactions - User ${request.user.sub}`);

    const data = request.query as GetPaginatedTransactions;
    const { accountId } = request.params as AccountIdFromParam;

    const dataFormated = {
        accountId,
        page: +data.page,
        offset: +data.offset,
        ...(data.type ? { type: data.type } : {}),
        ...(data.paymentMethod ? { paymentMethod: data.paymentMethod } : {}),
        ...(data.name ? { name: data.name } : {})
    };

    try {
        const transactionService = getTransactionsFactory();
        const transactions = await transactionService.execute(dataFormated);
        logger.info(`${filename} -> Get paginated transactions successfully - User ${request.user.sub}`);

        reply.status(StatusCodes.OK).send(transactions);
    } catch (error) {
        if (error instanceof AccountNotFoundError) {
            logger.error(`${filename} -> Get paginated transactions failed - Account not fount - User ${request.user.sub}`);
            return reply.status(StatusCodes.NOT_FOUND).send({ message: error.message });
        }

        logger.error(`${filename} -> Unexpected error during find many paginated transactions: ${error}`);
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Unknown error' });
    }
}
