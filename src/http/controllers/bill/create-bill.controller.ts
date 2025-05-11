import { FastifyRequest, FastifyReply } from 'fastify';
import logger from '../../../utils/libs/logger';
import { CreateBillBodyType } from '../../../utils/schemas/request/bills/create-bill.schema';
import { AccountNotFoundError } from '../../../utils/errors/account-not-found-error';
import { StatusCodes } from 'http-status-codes';
import { BillFactory } from '../../../services/factories/bill.factory';
const filename = __filename.split(/[/\\]/).pop();

export async function createBill(request: FastifyRequest, reply: FastifyReply) {
    logger.info(`${filename} -> Initiating create bill - User ${request.user.sub}`);
    const data = request.body as CreateBillBodyType;

    try {
        const billService = BillFactory();
        await billService.create(data);
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