import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { getBillsInPeriodFactory } from '../../../use-cases/_factories/get-bills-in-period.factory';
import { AccountNotFoundError } from '../../../utils/errors/account-not-found-error';
import logger from '../../../utils/libs/logger';
import { AccountIdFromParam } from '../../../utils/types/account/account-id-from-param';
import { GetBillsInPeriodQuery } from '../../../utils/types/bills/get-bills-in-period';

const filename = __filename.split(/[/\\]/).pop();

export async function getBillsInPeriod(request: FastifyRequest, reply: FastifyReply) {
    logger.info(`${filename} -> Get Bills in period - User ${request.user.sub}`);

    const { startDate, endDate } = request.query as GetBillsInPeriodQuery;
    const { accountId } = request.params as AccountIdFromParam;

    try {
        const billService = getBillsInPeriodFactory();
        const bills = await billService.execute(accountId, startDate, endDate);
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
