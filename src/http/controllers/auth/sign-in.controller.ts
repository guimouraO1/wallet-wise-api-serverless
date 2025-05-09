import { FastifyRequest, FastifyReply } from 'fastify';
import { InvalidCredentialsError } from '../../../utils/errors/invalid-credentials-error';
import { authFactory } from '../../../services/factories/auth.factory';
import { env } from '../../../utils/lib/env';
import { SignInBodyType } from '../../../utils/schemas/request/auth/sign-in.schema';
import { StatusCodes } from 'http-status-codes';
import logger from '../../../utils/lib/logger';

const filename = __filename.split(/[/\\]/).pop();

export async function signIn(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = request.body as SignInBodyType;
    logger.info(`${filename} -> Initiating sign-in process for email: ${email}`);

    try {
        const authService = authFactory();
        const user = await authService.signIn({ email, password });
        logger.info(`${filename} -> Authentication successful for user ${user.id}`);

        const token = await reply.jwtSign({ role: user.role }, { sign: { sub: user.id } });
        const refreshToken = await reply.jwtSign({ role: user.role }, { sign: { sub: user.id, expiresIn: env.JWT_REFRESH_TOKEN_EXPIRATION_TIME } });

        reply.setCookie(env.REFRESH_TOKEN_NAME, refreshToken, {
            path: '/',
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'none',
            signed: true
        }).status(StatusCodes.OK).send({ token });

        logger.info(`${filename} -> Tokens issued successfully for user ID: ${user.id}`);
    } catch (error) {
        if (error instanceof InvalidCredentialsError) {
            logger.error(`${filename} -> Failed sign-in attempt: Invalid credentials for email ${email}`);
            return reply.status(StatusCodes.UNAUTHORIZED).send({ message: error.message });
        }

        logger.error(`${filename} -> Unexpected error during sign-in: ${error}`);
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Unknown error' });
    }
}
