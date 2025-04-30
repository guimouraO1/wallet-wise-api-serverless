import { FastifyRequest, FastifyReply } from 'fastify';
import { userFactory } from '../../../services/factories/user.factory';
import { UserAlreadyExistsError } from '../../../utils/errors/user-already-exists-error';
import { CreateUserBodyType } from '../../../utils/schemas/request/user/create-user.schema';
import { StatusCodes } from 'http-status-codes';
import logger from '../../../utils/lib/logger';
import { CreateUserError } from '../../../utils/errors/create-user-error';

const filename = __filename.split(/[/\\]/).pop();

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
    const { email, password, name, avatarUrl } = request.body as CreateUserBodyType;
    logger.info(`${filename} -> Initiating user creation for email: ${email}`);

    try {
        const userService = userFactory();
        await userService.create({ email, password, name, avatarUrl });
        logger.info(`${filename} -> User created successfully: ${email}`);

        reply.status(StatusCodes.CREATED).send({});
    } catch (error) {
        if (error instanceof UserAlreadyExistsError) {
            logger.error(`${filename} -> User creation failed: Email already in use (${email})`);
            return reply.status(StatusCodes.CONFLICT).send({ message: error.message });
        }

        if (error instanceof CreateUserError) {
            logger.error(`${filename} -> User creation failed: Unexpected error (${error})`);
            return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: error.message });
        }

        logger.error(`${filename} -> Unexpected error during user creation: ${error}`);
        throw error;
    }
}
