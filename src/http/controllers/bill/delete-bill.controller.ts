import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { deleteBillFactory } from '../../../use-cases/_factories/delete-bill.factory';
import { BillNotFoundError } from '../../../utils/errors/bill-not-found-error';
import logger from '../../../utils/libs/logger';
import { DeleteBillParams } from '../../../utils/types/bills/delete-bill';

const filename = __filename.split(/[/\\]/).pop();

export async function deleteBill(request: FastifyRequest, reply: FastifyReply) {
    logger.info(`${filename} -> Initiating delete bill - User ${request.user.sub}`);
    const { id } = request.params as DeleteBillParams;

    try {
        const billService = deleteBillFactory();
        await billService.execute(id);
        logger.info(`${filename} -> Bill deleted successfully - User ${request.user.sub}`);

        reply.status(StatusCodes.CREATED).send({});
    } catch (error) {
        if (error instanceof BillNotFoundError) {
            logger.error(`${filename} -> Delete Bill Error - Bill not fount - User ${request.user.sub}`);
            return reply.status(StatusCodes.NOT_FOUND).send({ message: error.message });
        }

        logger.error(`${filename} -> Unexpected error during create transaction: ${error}`);
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Unknown error' });
    }

}