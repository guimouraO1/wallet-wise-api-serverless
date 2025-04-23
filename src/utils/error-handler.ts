import { StatusCodes } from 'http-status-codes';
import { env } from '@/utils/lib/env';
import { FastifyReply, FastifyRequest } from 'fastify';

export function errorHandler(error: any, request: FastifyRequest, reply: FastifyReply) {
    if (error.validation) {
        return reply.status(StatusCodes.BAD_REQUEST).send({
            message: 'Bad request',
            status: StatusCodes.BAD_REQUEST,
            errors: error.validation.map((err: any) => ({
                key: err.params?.missingProperty,
                value: err.message
            }))
        });
    }

    if (env.NODE_ENV !== 'production') {
        console.error(error);
    }

    return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Internal Server Error' });
}
