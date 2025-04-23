import { FastifyRequest, FastifyReply } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { transactionFactory } from '../../../services/factories/transaction.factory';
import { AccountNotFoundError } from '../../../utils/errors/account-not-found-error';
// import logger from '../../../utils/lib/logger';
import { AccountIdParam } from '../../../utils/schemas/account-id-param';
import { FindManyInPeriodTransactionsQueryParams } from '../../../utils/schemas/transactions/find-many-in-period-transactions-schema';

// const filename = __filename.split(/[/\\]/).pop();

export async function findManyTransactionsInPeriod(request: FastifyRequest, reply: FastifyReply) {
    // logger.info(`${filename} -> Initiating find transactions in period - User ${request.user.sub}`);

    const { startDate, endDate } = request.query as FindManyInPeriodTransactionsQueryParams;
    const { accountId } = request.params as AccountIdParam;

    try {
        const transactionService = transactionFactory();
        const transactions = await transactionService.findManyInPeriodByAccountId(accountId, startDate, endDate);
        // logger.info(`${filename} -> Finded many transactions in period - User ${request.user.sub}`);

        reply.status(StatusCodes.OK).send(transactions);
    } catch (error) {
        if (error instanceof AccountNotFoundError) {
            // logger.error(`${filename} -> Find many transactions in period failed - Account not fount - User ${request.user.sub}`);
            return reply.status(StatusCodes.NOT_FOUND).send({ message: error.message });
        }

        // logger.error(`${filename} -> Unexpected error during find many paginated transactions: ${error}`);
        throw error;
    }
}
