import { FastifyRequest, FastifyReply } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import logger from '../../../utils/lib/logger';
import { transactionFactory } from '../../../services/factories/transaction.factory';
import { DeleteTransactionParams } from '../../../utils/schemas/transactions/delete-transaction';

const filename = __filename.split(/[/\\]/).pop();

export async function deleteTransaction(request: FastifyRequest, reply: FastifyReply) {
    const { transactionId } = request.params as DeleteTransactionParams;

    logger.info(`${filename} -> Initiating delete transaction - User ${request.user.sub}`);

    try {
        const transactionService = transactionFactory();
        await transactionService.delete(transactionId);
        logger.info(`${filename} -> Transaction successfully deleted - User ${request.user.sub}`);

        return reply.status(StatusCodes.OK).send({});
    } catch (error) {
        logger.error(`${filename} -> Unexpected error during create transaction: ${error}`);
        throw error;
    }
}
