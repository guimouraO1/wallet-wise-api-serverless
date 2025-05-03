import { FastifyTypedInstance } from '../../../@types/fastify-type';
import { BadRequestSchema } from '../../../utils/schemas/responses/errors/bad-request.schema';
import { InternalServerErrorSchema } from '../../../utils/schemas/responses/errors/internal-server-error.schema';
import { UnauthorizedSchema } from '../../../utils/schemas/responses/errors/unauthorized.schema';
import { createUser } from './create-user.controller';
import { CreatedSchema } from '../../../utils/schemas/responses/default-responses/created.schema';
import { ConflictSchema } from '../../../utils/schemas/responses/errors/conflict.schema';
import { CreateUserBody } from '../../../utils/schemas/request/user/create-user.schema';
import { ForbiddenSchema } from '../../../utils/schemas/responses/errors/forbidden.schema';
import { verifyJwt } from '../../middlewares/verify-jwt';
import { UserIdParam } from '../../../utils/schemas/request/user/user-id-param.schema';
import { NotFoundSchema } from '../../../utils/schemas/responses/errors/not-found.schema';
import { getUserById } from './get-user-by-id.controller';
import { authorizeAdminOnly } from '../../middlewares/authorize-admin-only';
import { authorizeOwnerOrAdminByUserIdParam } from '../../middlewares/authorize-by-user-id-param';
import { GetUserByIdResponse } from '../../../utils/schemas/responses/user/find-user.schema';

export async function userRoutes(app: FastifyTypedInstance) {
    app.post('/user',
        {
            onRequest: [verifyJwt, authorizeAdminOnly],
            schema: {
                description: 'Create User',
                tags: ['User'],
                security: [{ BearerAuth: [] }],
                body: CreateUserBody,
                response: {
                    201: CreatedSchema.describe('User Created'),
                    400: BadRequestSchema,
                    401: UnauthorizedSchema,
                    403: ForbiddenSchema,
                    409: ConflictSchema,
                    500: InternalServerErrorSchema
                }
            }
        },
        createUser
    );

    app.get('/user/:userId',
        {
            onRequest: [verifyJwt, authorizeOwnerOrAdminByUserIdParam],
            schema: {
                description: 'Get User By ID',
                tags: ['User'],
                security: [{ BearerAuth: [] }],
                params: UserIdParam,
                response: {
                    200: GetUserByIdResponse.describe('User Founded'),
                    400: BadRequestSchema,
                    401: UnauthorizedSchema,
                    403: ForbiddenSchema,
                    404: NotFoundSchema.describe('User Not Found'),
                    500: InternalServerErrorSchema
                }
            }
        },
        getUserById
    );
}