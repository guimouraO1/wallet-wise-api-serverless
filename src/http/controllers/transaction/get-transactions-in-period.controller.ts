import { FastifyRequest, FastifyReply } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { AccountNotFoundError } from '../../../utils/errors/account-not-found-error';
import logger from '../../../utils/libs/logger';
import { AccountIdParamType } from '../../../utils/schemas/request/account/account-id-param.schema';
import { GetTransactionsInPeriodQueryType } from '../../../utils/schemas/request/transactions/get-transactions-in-period.schema';
import { getTransactionsInPeriodFactory } from '../../../use-cases/_factories/get-transactions-in-period.factory';

const filename = __filename.split(/[/\\]/).pop();

export async function getTransactionsInPeriod(request: FastifyRequest, reply: FastifyReply) {
    logger.info(`${filename} -> Get transactions in period - User ${request.user.sub}`);

    const { startDate, endDate, type } = request.query as GetTransactionsInPeriodQueryType;
    const { accountId } = request.params as AccountIdParamType;

    try {
        const transactionService = getTransactionsInPeriodFactory();
        const transactions = await transactionService.execute({ accountId, startDate, endDate, type });
        logger.info(`${filename} -> Get transactions in period successfully - User ${request.user.sub}`);

        reply.status(StatusCodes.OK).send(transactions);
    } catch (error) {
        if (error instanceof AccountNotFoundError) {
            logger.error(`${filename} -> Get transactions in period failed - Account not fount - User ${request.user.sub}`);
            return reply.status(StatusCodes.NOT_FOUND).send({ message: error.message });
        }

        logger.error(`${filename} -> Unexpected error during find many paginated transactions: ${error}`);
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Unknown error' });
    }
}
