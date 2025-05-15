import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { getTransactionsSummaryFactory } from '../../../use-cases/_factories/get-transactions-summary.factory';
import { AccountNotFoundError } from '../../../utils/errors/account-not-found-error';
import logger from '../../../utils/libs/logger';
import { AccountIdFromParam } from '../../../utils/types/account/account-id-from-param';
import { GetTransactionsSummary } from '../../../utils/types/transactions/get-transactions-summary-request';

const filename = __filename.split(/[/\\]/).pop();

export async function getTransactionsSummary(request: FastifyRequest, reply: FastifyReply) {
    logger.info(`${filename} -> Get transactions summary - User ${request.user.sub}`);

    const { year, type } = request.query as GetTransactionsSummary;
    const { accountId } = request.params as AccountIdFromParam;

    try {
        const getTransactionsUseCase = getTransactionsSummaryFactory();
        const transactionsSummary = await getTransactionsUseCase.execute({ accountId, year, type });

        logger.info(`${filename} -> Get transactions summary successfully - User ${request.user.sub}`);
        reply.status(StatusCodes.OK).send(transactionsSummary);
    } catch (error) {
        if (error instanceof AccountNotFoundError) {
            logger.error(`${filename} -> Get transactions summary failed - Account not fount - User ${request.user.sub}`);
            return reply.status(StatusCodes.NOT_FOUND).send({ message: error.message });
        }

        logger.error(`${filename} -> Unexpected error during get transactions by year: ${error}`);
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Unknown error' });
    }
}
