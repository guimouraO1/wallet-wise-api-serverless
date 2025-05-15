import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { createBillFactory } from '../../../use-cases/_factories/create-bill.factory';
import { AccountNotFoundError } from '../../../utils/errors/account-not-found-error';
import logger from '../../../utils/libs/logger';
import { CreateBillBody } from '../../../utils/types/bills/create-bill-body';

const filename = __filename.split(/[/\\]/).pop();

export async function createBill(request: FastifyRequest, reply: FastifyReply) {
    logger.info(`${filename} -> Initiating create bill - User ${request.user.sub}`);
    const data = request.body as CreateBillBody;

    try {
        const billService = createBillFactory();
        await billService.execute(data);
        logger.info(`${filename} -> Bill created successfully - User ${request.user.sub}`);

        reply.status(StatusCodes.CREATED).send({});
    } catch (error) {
        if (error instanceof AccountNotFoundError) {
            logger.error(`${filename} -> Create Bill failed - Account not fount - User ${request.user.sub}`);
            return reply.status(StatusCodes.NOT_FOUND).send({ message: error.message });
        }

        logger.error(`${filename} -> Unexpected error during create transaction: ${error}`);
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Unknown error' });
    }

}