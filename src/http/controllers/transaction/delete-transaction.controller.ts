import { FastifyRequest, FastifyReply } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import logger from '../../../utils/libs/logger';
import { DeleteTransactionParamsType } from '../../../utils/schemas/request/transactions/delete-transaction.schema';
import { deleteTransactionFactory } from '../../../use-cases/_factories/delete-transaction.factory';
import { TransactionNotFoundError } from '../../../utils/errors/transaction-not-found-error';

const filename = __filename.split(/[/\\]/).pop();

export async function deleteTransaction(request: FastifyRequest, reply: FastifyReply) {
    const { transactionId } = request.params as DeleteTransactionParamsType;
    logger.info(`${filename} -> Initiating delete transaction - User ${request.user.sub}`);

    try {
        const transactionService = deleteTransactionFactory();
        await transactionService.execute(transactionId);
        logger.info(`${filename} -> Transaction successfully deleted - User ${request.user.sub}`);

        return reply.status(StatusCodes.OK).send({});
    } catch (error) {
        if (error instanceof TransactionNotFoundError) {
            logger.error(`${filename} -> Delete transaction Error - Transaction not fount - User ${request.user.sub}`);
            return reply.status(StatusCodes.NOT_FOUND).send({ message: error.message });
        }

        logger.error(`${filename} -> Unexpected error during create transaction: ${error}`);
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Unknown error' });
    }
}
