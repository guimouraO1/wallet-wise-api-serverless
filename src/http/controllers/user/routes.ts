import { FastifyTypedInstance } from '@/@types/fastify-type';
import { BadRequestSchema } from '@/utils/schemas/errors/bad-request-schema';
import { InternalServerErrorSchema } from '@/utils/schemas/errors/internal-server-error-schema';
import { UnauthorizedSchema } from '@/utils/schemas/errors/unauthorized-schema';
import { createUser } from './create-user.controller';
import { CreatedSchema } from '@/utils/schemas/default-responses/created-schema';
import { ConflictSchema } from '@/utils/schemas/errors/conflict-schema';
import { CreateUserRequestSchema } from '@/utils/schemas/user/create-user-schema';
import { ForbiddenSchema } from '@/utils/schemas/errors/forbidden-schema';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { UserIdParam } from '@/utils/schemas/user-id-param';
import { NotFoundSchema } from '@/utils/schemas/errors/not-found-schema';
import { getUserById } from './get-user-by-id.controller';
import { authorizeAdminOnly } from '@/http/middlewares/authorize-admin-only';
import { authorizeOwnerOrAdminByUserIdParam } from '@/http/middlewares/authorize-by-user-id-param';
import { GetUserByIdResponseZod } from '@/utils/schemas/user/find-user-schema';

export async function userRoutes(app: FastifyTypedInstance) {
    app.post('/user',
        {
            onRequest: [verifyJwt, authorizeAdminOnly],
            schema: {
                description: 'Create User',
                tags: ['User'],
                security: [{ BearerAuth: [] }],
                body: CreateUserRequestSchema,
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
                    200: GetUserByIdResponseZod.describe('User Founded'),
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