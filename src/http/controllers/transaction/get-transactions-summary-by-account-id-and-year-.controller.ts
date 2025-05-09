import { FastifyRequest, FastifyReply } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { getTransactionsSummaryByAccountIdAndYearFactory } from '../../../use-cases/_factories/get-transactions-summary-by-account-id-and-year.factory';
import { AccountNotFoundError } from '../../../utils/errors/account-not-found-error';
import logger from '../../../utils/lib/logger';
import { AccountIdParamType } from '../../../utils/schemas/request/account/account-id-param.schema';
import { GetTransactionsSummaryByAccountIdAndYearRequestType }
    from '../../../utils/schemas/request/transactions/get-transactions-summary-by-account-id-and-year.schema';

const filename = __filename.split(/[/\\]/).pop();

export async function getTransactionsSummaryByAccountIdAndYear(request: FastifyRequest, reply: FastifyReply) {
    logger.info(`${filename} -> Get transactions by year - User ${request.user.sub}`);

    const { year, type } = request.query as GetTransactionsSummaryByAccountIdAndYearRequestType;
    const { accountId } = request.params as AccountIdParamType;

    try {
        const transactionService = getTransactionsSummaryByAccountIdAndYearFactory();
        const transactions = await transactionService.execute({ accountId, year, type });

        logger.info(`${filename} -> Get transactions by year successfully - User ${request.user.sub}`);
        reply.status(StatusCodes.OK).send(transactions);
    } catch (error) {
        if (error instanceof AccountNotFoundError) {
            logger.error(`${filename} -> Get transactions by year failed - Account not fount - User ${request.user.sub}`);
            return reply.status(StatusCodes.NOT_FOUND).send({ message: error.message });
        }

        logger.error(`${filename} -> Unexpected error during get transactions by year: ${error}`);
        throw error;
    }
}
