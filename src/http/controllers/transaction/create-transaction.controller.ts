import { FastifyRequest, FastifyReply } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import logger from '@/utils/lib/logger';
import { TransactionCreateSchemaType } from '@/utils/schemas/transactions/create-transaction-schema';
import { transactionFactory } from '@/services/factories/transaction.factory';
import { AccountNotFoundError } from '@/utils/errors/account-not-found-error';
import { UpdateAccountError } from '@/utils/errors/update-account-error';

const filename = __filename.split(/[/\\]/).pop();

export async function createTransaction(request: FastifyRequest, reply: FastifyReply) {
    const data = request.body as TransactionCreateSchemaType;

    logger.info(`${filename} -> Initiating transaction - User ${request.user.sub}`);

    try {
        const transactionService = transactionFactory();
        await transactionService.create(data);
        logger.info(`${filename} -> Transaction successfully - User ${request.user.sub}`);

        reply.status(StatusCodes.CREATED).send({});
    } catch (error) {
        if (error instanceof AccountNotFoundError) {
            logger.error(`${filename} -> Create Transaction failed - Account not fount - User ${request.user.sub}`);
            return reply.status(StatusCodes.NOT_FOUND).send({ message: error.message });
        }

        if (error instanceof UpdateAccountError) {
            logger.error(`${filename} -> Create Transaction Error - User ${request.user.sub}`);
            return reply.status(StatusCodes.NOT_FOUND).send({ message: error.message });
        }

        logger.error(`${filename} -> Unexpected error during create transaction: ${error}`);
        throw error;
    }
}
