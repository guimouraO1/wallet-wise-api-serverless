import { FastifyRequest, FastifyReply } from 'fastify';
import { env } from '../../../utils/libs/env';
import { StatusCodes } from 'http-status-codes';
import logger from '../../../utils/libs/logger';

const filename = __filename.split(/[/\\]/).pop();

export async function signOut(request: FastifyRequest, reply: FastifyReply) {
    logger.info(`${filename} -> Initiating sign-out process...`);

    try {
        await request.jwtVerify({ onlyCookie: true });
        logger.info(`${filename} -> JWT verification successful. Clearing refresh token.`);

        return reply.clearCookie(env.REFRESH_TOKEN_NAME).status(StatusCodes.OK).send({});
    } catch {
        logger.error(`${filename} -> Sign-out failed: Unauthorized request.`);
        return reply.status(StatusCodes.UNAUTHORIZED).send({ message: 'Unauthorized' });
    }
}
