import { FastifyRequest, FastifyReply } from 'fastify';
import { UserAlreadyExistsError } from '../../../utils/errors/user-already-exists-error';
import { CreateUserBodyType } from '../../../utils/schemas/request/user/create-user.schema';
import { StatusCodes } from 'http-status-codes';
import logger from '../../../utils/libs/logger';
import { createUserFactory } from '../../../use-cases/_factories/create-user.factory';
import { CreateUserError } from '../../../utils/errors/create-user-error';

const filename = __filename.split(/[/\\]/).pop();

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
    const data = request.body as CreateUserBodyType;
    logger.info(`${filename} -> Initiating user creation for email: ${data.email}`);

    try {
        const userService = createUserFactory();
        await userService.execute(data);
        logger.info(`${filename} -> User created successfully: ${data.email}`);

        reply.status(StatusCodes.CREATED).send({});
    } catch (error) {
        if (error instanceof UserAlreadyExistsError) {
            logger.error(`${filename} -> User creation failed: Email already in use (${data.email})`);
            return reply.status(StatusCodes.CONFLICT).send({ message: error.message });
        }

        if (error instanceof CreateUserError) {
            logger.error(`${filename} -> User creation failed -  Error unknown`);
            return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: error.message });
        }

        logger.error(`${filename} -> Unexpected error during user creation: ${error}`);
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Unknown error' });
    }
}
