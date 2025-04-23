import { env } from '../../../utils/lib/env';
import { FastifyRequest, FastifyReply } from 'fastify';
import { StatusCodes } from 'http-status-codes';
// import logger from '../../../utils/lib/logger';

// const filename = __filename.split(/[/\\]/).pop();

export async function refreshToken(request: FastifyRequest, reply: FastifyReply) {
    // logger.info(`${filename} -> Initiating token refresh process...`);

    try {
        await request.jwtVerify({ onlyCookie: true });
        // logger.info(`${filename} -> Refresh JWT verification successful.`);

        const { role } = request.user;

        const token = await reply.jwtSign({ role }, { sign: { sub: request.user.sub } });
        const refreshToken = await reply.jwtSign({ role },{ sign: { sub: request.user.sub, expiresIn: env.JWT_REFRESH_TOKEN_EXPIRATION_TIME } });

        reply.setCookie(env.REFRESH_TOKEN_NAME, refreshToken, {
            path: '/',
            httpOnly: true,
            secure: env.NODE_ENV === 'production' ? true : false,
            sameSite: 'none',
            signed: true
        }).status(StatusCodes.OK).send({ token });
        // logger.info(`${filename} -> Token refresh successful for user ${request.user.sub}`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
        // logger.error(`${filename} -> Token refresh failed: Unauthorized access attempt.`, error);
        return reply.status(StatusCodes.UNAUTHORIZED).send({ message: 'Unauthorized' });
    }
}
