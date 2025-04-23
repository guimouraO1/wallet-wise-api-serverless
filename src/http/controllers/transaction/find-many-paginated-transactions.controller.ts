import { FastifyRequest, FastifyReply } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { transactionFactory } from '../../../services/factories/transaction.factory';
import { AccountNotFoundError } from '../../../utils/errors/account-not-found-error';
import { FindManyTransactionsRequestSchemaType } from '../../../utils/schemas/transactions/find-many-transactions-schema';
// import logger from '../../../utils/lib/logger';
import { AccountIdParam } from '../../../utils/schemas/account-id-param';

// const filename = __filename.split(/[/\\]/).pop();

export async function findManyPaginatedTransactions(request: FastifyRequest, reply: FastifyReply) {
    // logger.info(`${filename} -> Initiating find paginated transactions - User ${request.user.sub}`);

    const data = request.query as FindManyTransactionsRequestSchemaType;
    const { accountId } = request.params as AccountIdParam;

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
        const transactions = await transactionService.findManyByAccountId(dataFormated);
        // logger.info(`${filename} -> Finded many paginated transactions - User ${request.user.sub}`);

        reply.status(StatusCodes.OK).send(transactions);
    } catch (error) {
        if (error instanceof AccountNotFoundError) {
            // logger.error(`${filename} -> Find many paginated transactions failed - Account not fount - User ${request.user.sub}`);
            return reply.status(StatusCodes.NOT_FOUND).send({ message: error.message });
        }

        // logger.error(`${filename} -> Unexpected error during find many paginated transactions: ${error}`);
        throw error;
    }
}
