import { FastifyTypedInstance } from '@/@types/fastify-type';
import { InternalServerErrorSchema } from '@/utils/schemas/errors/internal-server-error-schema';
import { UnauthorizedSchema } from '@/utils/schemas/errors/unauthorized-schema';
import { ForbiddenSchema } from '@/utils/schemas/errors/forbidden-schema';
import { NotFoundSchema } from '@/utils/schemas/errors/not-found-schema';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { getAccount } from './get-account-by-user-id.controller';
import { authorizeOwnerOrAdminByUserIdParam } from '@/http/middlewares/authorize-by-user-id-param';
import { UserIdParam } from '@/utils/schemas/user-id-param';
import { AccountResponseSchema } from '@/utils/schemas/account/account-schema';

export async function accountRoutes(app: FastifyTypedInstance) {
    app.get('/account/:userId',
        {
            onRequest: [verifyJwt, authorizeOwnerOrAdminByUserIdParam],
            schema: {
                description: 'Get Account',
                tags: ['Account'],
                security: [{ BearerAuth: [] }],
                params: UserIdParam,
                response: {
                    200: AccountResponseSchema,
                    401: UnauthorizedSchema,
                    403: ForbiddenSchema,
                    404: NotFoundSchema,
                    500: InternalServerErrorSchema
                }
            }
        },
        getAccount
    );
}