import { FastifyTypedInstance } from '../../../@types/fastify-type';
import { InternalServerErrorSchema } from '../../../utils/schemas/responses/errors/internal-server-error.schema';
import { UnauthorizedSchema } from '../../../utils/schemas/responses/errors/unauthorized.schema';
import { ForbiddenSchema } from '../../../utils/schemas/responses/errors/forbidden.schema';
import { NotFoundSchema } from '../../../utils/schemas/responses/errors/not-found.schema';
import { verifyJwt } from '../../middlewares/verify-jwt';
import { getAccount } from './get-account-by-user-id.controller';
import { authorizeOwnerOrAdminByUserIdParam } from '../../middlewares/authorize-by-user-id-param';
import { UserIdParam } from '../../../utils/schemas/request/user/user-id-param.schema';
import { GetAccountResponse } from '../../../utils/schemas/responses/account/get-account.schema';

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
                    200: GetAccountResponse,
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