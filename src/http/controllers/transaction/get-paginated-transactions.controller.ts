import { FastifyRequest, FastifyReply } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { transactionFactory } from '../../../services/factories/transaction.factory';
import { AccountNotFoundError } from '../../../utils/errors/account-not-found-error';
import { GetPaginatedTransactionsQueryType } from '../../../utils/schemas/request/transactions/get-paginated-transactions.schema';
import logger from '../../../utils/lib/logger';
import { AccountIdParamType } from '../../../utils/schemas/request/account/account-id-param.schema';

const filename = __filename.split(/[/\\]/).pop();

export async function getPaginatedTransactions(request: FastifyRequest, reply: FastifyReply) {
    logger.info(`${filename} -> Get paginated transactions - User ${request.user.sub}`);

    const data = request.query as GetPaginatedTransactionsQueryType;
    const { accountId } = request.params as AccountIdParamType;

    const dataFormated = {
        accountId,
        page: +data.page,
        offset: +data.offset,
        ...(data.type ? { type: data.type } : {}),
        ...(data.paymentMethod ? { paymentMethod: data.paymentMethod } : {}),
        ...(data.name ? { name: data.name } : {})
    };

    try {
        const transactionService = transactionFactory();
        const transactions = await transactionService.getByAccountId(dataFormated);
        logger.info(`${filename} -> Get paginated transactions successfully - User ${request.user.sub}`);

        reply.status(StatusCodes.OK).send(transactions);
    } catch (error) {
        if (error instanceof AccountNotFoundError) {
            logger.error(`${filename} -> Get paginated transactions failed - Account not fount - User ${request.user.sub}`);
            return reply.status(StatusCodes.NOT_FOUND).send({ message: error.message });
        }

        logger.error(`${filename} -> Unexpected error during find many paginated transactions: ${error}`);
        throw error;
    }
}
