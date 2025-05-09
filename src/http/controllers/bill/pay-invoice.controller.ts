import { FastifyRequest, FastifyReply } from 'fastify';
import logger from '../../../utils/lib/logger';
import { StatusCodes } from 'http-status-codes';
import { BillFactory } from '../../../services/factories/bill.factory';
import { AccountNotFoundError } from '../../../utils/errors/account-not-found-error';
import { NotFoundError } from '../../../utils/errors/not-found-error';
import { BillAlreadyPaid } from '../../../utils/errors/bill-already-paid-error';
import { PayInvoiceBodyType } from '../../../utils/schemas/request/bills/pay-invoice.schema';

const filename = __filename.split(/[/\\]/).pop();

export async function payInvoice(request: FastifyRequest, reply: FastifyReply) {
    logger.info(`${filename} -> Initiating pay invoice - User ${request.user.sub}`);
    const { accountId, billId } = request.body as PayInvoiceBodyType;

    try {
        const billService = BillFactory();
        await billService.payInvoice(accountId, billId);
        logger.info(`${filename} -> Pay invoice successfully - User ${request.user.sub}`);

        reply.status(StatusCodes.OK).send({});
    } catch (error) {
        if (error instanceof AccountNotFoundError) {
            logger.error(`${filename} -> Pay invoice successfully failed - Account not found - User ${request.user.sub}`);
            return reply.status(StatusCodes.NOT_FOUND).send({ message: error.message });
        }

        if (error instanceof NotFoundError) {
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