import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { FindManyBillsInput, FindManyBillsInputString } from '../../../repositories/bill-repository';
import { getBillsFactory } from '../../../use-cases/_factories/get-bills.factory';
import { AccountNotFoundError } from '../../../utils/errors/account-not-found-error';
import logger from '../../../utils/libs/logger';
import { AccountIdFromParam } from '../../../utils/types/account/account-id-from-param';

const filename = __filename.split(/[/\\]/).pop();

export async function getPaginatedBills(request: FastifyRequest, reply: FastifyReply) {
    logger.info(`${filename} -> Get paginated bills - User ${request.user.sub}`);

    const data = request.query as FindManyBillsInputString;
    const { accountId } = request.params as AccountIdFromParam;

    const dataFormated = {
        ...data,
        accountId,
        page: +data.page,
        offset: +data.offset,
        ...(data.active ? { active: data.active === 'true' } : {})
    };

    try {
        const billService = getBillsFactory();
        const bills = await billService.execute(dataFormated as FindManyBillsInput);
        logger.info(`${filename} -> Bills found successfully - User ${request.user.sub}`);

        return reply.status(StatusCodes.OK).send(bills);
    } catch (error) {
        if (error instanceof AccountNotFoundError) {
            logger.error(`${filename} -> Find many paginated bills failed - Account not fount - User ${request.user.sub}`);
            return reply.status(StatusCodes.NOT_FOUND).send({ message: error.message });
        }

        logger.error(`${filename} -> Unexpected error during create transaction: ${error}`);
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Unknown error' });
    }

}