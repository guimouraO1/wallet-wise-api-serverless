import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { payBillFactory } from '../../../use-cases/_factories/pay-bill.factory';
import { AccountNotFoundError } from '../../../utils/errors/account-not-found-error';
import { BillAlreadyPaid } from '../../../utils/errors/bill-already-paid-error';
import { BillNotFoundError } from '../../../utils/errors/bill-not-found-error';
import logger from '../../../utils/libs/logger';
import { PayBill } from '../../../utils/types/bills/pay-bill';

const filename = __filename.split(/[/\\]/).pop();

export async function payBill(request: FastifyRequest, reply: FastifyReply) {
    logger.info(`${filename} -> Initiating pay invoice - User ${request.user.sub}`);
    const { billId } = request.body as PayBill;

    try {
        const billService = payBillFactory();
        await billService.execute(billId);
        logger.info(`${filename} -> Pay invoice successfully - User ${request.user.sub}`);

        reply.status(StatusCodes.CREATED).send({});
    } catch (error) {
        if (error instanceof AccountNotFoundError) {
            logger.error(`${filename} -> Pay invoice successfully failed - Account not found - User ${request.user.sub}`);
            return reply.status(StatusCodes.NOT_FOUND).send({ message: error.message });
        }

        if (error instanceof BillNotFoundError) {
            logger.error(`${filename} -> Pay invoice successfully failed - Bill not found - User ${request.user.sub}`);
            return reply.status(StatusCodes.NOT_FOUND).send({ message: error.message });
        }

        if (error instanceof BillAlreadyPaid) {
            logger.error(`${filename} -> Pay invoice successfully failed - Bill already paid - User ${request.user.sub}`);
            return reply.status(StatusCodes.CONFLICT).send({ message: error.message });
        }

        logger.error(`${filename} -> Unexpected error during create transaction: ${error}`);
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Unknown error' });
    }

}