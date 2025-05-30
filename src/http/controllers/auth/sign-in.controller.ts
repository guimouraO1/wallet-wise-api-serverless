import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { signInFactory } from '../../../use-cases/_factories/sign-in.factory';
import { InvalidCredentialsError } from '../../../utils/errors/invalid-credentials-error';
import { UserNotFoundError } from '../../../utils/errors/user-not-found-error';
import { env } from '../../../utils/libs/env';
import logger from '../../../utils/libs/logger';
import { SignIn } from '../../../utils/types/auth/sign-in';

const filename = __filename.split(/[/\\]/).pop();

export async function signIn(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = request.body as SignIn;
    logger.info(`${filename} -> Initiating sign-in process for email: ${email}`);

    try {
        const authService = signInFactory();
        const user = await authService.execute({ email, password });
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
        if (error instanceof UserNotFoundError) {
            logger.error(`${filename} -> Failed sign-in attempt: User not found for email ${email}`);
            return reply.status(StatusCodes.NOT_FOUND).send({ message: error.message });
        }

        if (error instanceof InvalidCredentialsError) {
            logger.error(`${filename} -> Failed sign-in attempt: Invalid credentials for email ${email}`);
            return reply.status(StatusCodes.UNAUTHORIZED).send({ message: error.message });
        }

        logger.error(`${filename} -> Unexpected error during sign-in: ${error}`);
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Unknown error' });
    }
}
