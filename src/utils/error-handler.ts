import { StatusCodes } from 'http-status-codes';
import { env } from './libs/env';
import { FastifyReply, FastifyRequest, FastifyError } from 'fastify';

interface ValidationErrorItem {
  instancePath: string;
  message: string;
}

type ZodFastifyError = FastifyError & {
  validation?: ValidationErrorItem[];
  validationContext?: string;
};

export function errorHandler(error: ZodFastifyError, request: FastifyRequest, reply: FastifyReply) {
    if (error.validation) {
        const errors = error.validation.map(err => ({
            path: err.instancePath.replace(/^\//, ''),
            message: err.message
        }));

        return reply.status(StatusCodes.BAD_REQUEST).send({ message: 'Bad Request', errors });
    }

    if (env.NODE_ENV !== 'production') {
        console.error(error);
    }

    return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Unknown Error' });
}