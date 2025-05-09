import { FastifyRequest, FastifyReply } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { AccountNotFoundError } from '../../../utils/errors/account-not-found-error';
import logger from '../../../utils/lib/logger';
import { AccountIdParamType } from '../../../utils/schemas/request/account/account-id-param.schema';
import { BillFactory } from '../../../services/factories/bill.factory';
import { GetBillsInPeriodQueryType } from '../../../utils/schemas/request/bills/get-bills-in-period.schema';

const filename = __filename.split(/[/\\]/).pop();

export async function getBillsInPeriod(request: FastifyRequest, reply: FastifyReply) {
    logger.info(`${filename} -> Get Bills in period - User ${request.user.sub}`);

    const { startDate, endDate } = request.query as GetBillsInPeriodQueryType;
    const { accountId } = request.params as AccountIdParamType;

    try {
        const billService = BillFactory();
        const bills = await billService.getByAccountIdInPeriod(accountId, startDate, endDate);
        logger.info(`${filename} -> Get Bills in period successfully - User ${request.user.sub}`);

        reply.status(StatusCodes.OK).send(bills);
    } catch (error) {
        if (error instanceof AccountNotFoundError) {
            logger.error(`${filename} -> Get Bills in period failed - Account not fount - User ${request.user.sub}`);
            return reply.status(StatusCodes.NOT_FOUND).send({ message: error.message });
        }

        logger.error(`${filename} -> Unexpected error during get Bills in period: ${error}`);
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Unknown error' });
    }
}
