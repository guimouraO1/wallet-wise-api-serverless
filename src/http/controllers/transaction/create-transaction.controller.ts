import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { createTransactionFactory } from '../../../use-cases/_factories/create-transaction.factory';
import { AccountNotFoundError } from '../../../utils/errors/account-not-found-error';
import { CreateTransactionError } from '../../../utils/errors/create-transaction-error';
import { YouAreNotElonError } from '../../../utils/errors/elon-error';
import logger from '../../../utils/libs/logger';
import { CreateTransaction } from '../../../utils/types/transactions/create-transaction';

const filename = __filename.split(/[/\\]/).pop();

export async function createTransaction(request: FastifyRequest, reply: FastifyReply) {
    const data = request.body as CreateTransaction;
    logger.info(`${filename} -> Initiating create transaction - User ${request.user.sub}`);

    try {
        const transactionService = createTransactionFactory();
        await transactionService.execute(data);

        logger.info(`${filename} -> Transaction created successfully - User ${request.user.sub}`);
        reply.status(StatusCodes.CREATED).send({});
    } catch (error) {
        if (error instanceof AccountNotFoundError) {
            logger.error(`${filename} -> Create Transaction Error - Account not fount - User ${request.user.sub}`);
            return reply.status(StatusCodes.NOT_FOUND).send({ message: error.message });
        }

        if (error instanceof YouAreNotElonError) {
            logger.error(`${filename} -> Create Transaction Error (+10_000_000_000)) - User ${request.user.sub}`);
            return reply.status(StatusCodes.UNPROCESSABLE_ENTITY).send({ message: error.message });
        }

        if (error instanceof CreateTransactionError) {
            logger.error(`${filename} -> Create Transaction Error - User ${request.user.sub}`);
            return reply.status(StatusCodes.NOT_FOUND).send({ message: error.message });
        }

        logger.error(`${filename} -> Unexpected error during create transaction: ${error}`);
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Unknown error' });
    }
}
