import { FastifyRequest, FastifyReply } from 'fastify';
import logger from '../../../utils/lib/logger';
import { AccountNotFoundError } from '../../../utils/errors/account-not-found-error';
import { StatusCodes } from 'http-status-codes';
import { BillFactory } from '../../../services/factories/bill.factory';
import { FindManyBillsInput, FindManyBillsInputString } from '../../../repositories/bill-repository';
import { AccountIdParam } from '../../../utils/schemas/account-id-param';
const filename = __filename.split(/[/\\]/).pop();

export async function findManyPaginatedBills(request: FastifyRequest, reply: FastifyReply) {
    logger.info(`${filename} -> Initiating find many paginated bills - User ${request.user.sub}`);

    const data = request.query as FindManyBillsInputString;
    const { accountId } = request.params as AccountIdParam;

    const dataFormated = {
        ...data,
        accountId,
        page: +data.page,
        offset: +data.offset,
        // eslint-disable-next-line no-prototype-builtins
        ...(data.hasOwnProperty('active') ? { active: data.active === 'true' } : {})
    };

    try {
        const billService = BillFactory();
        const bills = await billService.findManyByAccountId(dataFormated as FindManyBillsInput);
        logger.info(`${filename} -> Bills finded successfully - User ${request.user.sub}`);

        return reply.status(StatusCodes.OK).send(bills);
    } catch (error) {
        if (error instanceof AccountNotFoundError) {
            logger.error(`${filename} -> Find many paginated bills failed - Account not fount - User ${request.user.sub}`);
            return reply.status(StatusCodes.NOT_FOUND).send({ message: error.message });
        }

        logger.error(`${filename} -> Unexpected error during create transaction: ${error}`);
        throw error;
    }

}