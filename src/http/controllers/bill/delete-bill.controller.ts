import { FastifyRequest, FastifyReply } from 'fastify';
import logger from '../../../utils/lib/logger';
import { StatusCodes } from 'http-status-codes';
import { BillFactory } from '../../../services/factories/bill.factory';
import { DeleteBillParamType } from '../../../utils/schemas/request/bills/delete-bill.schema';

const filename = __filename.split(/[/\\]/).pop();

export async function deleteBill(request: FastifyRequest, reply: FastifyReply) {
    logger.info(`${filename} -> Initiating delete bill - User ${request.user.sub}`);
    const { id } = request.params as DeleteBillParamType;

    try {
        const billService = BillFactory();
        await billService.delete(id);
        logger.info(`${filename} -> Bill deleted successfully - User ${request.user.sub}`);

        reply.status(StatusCodes.CREATED).send({});
    } catch (error) {
        logger.error(`${filename} -> Unexpected error during create transaction: ${error}`);
        throw error;
    }

}