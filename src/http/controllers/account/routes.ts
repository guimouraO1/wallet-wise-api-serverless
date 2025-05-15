import { FastifyTypedInstance } from '../../../@types/fastify-type';
import { ZAccount } from '../../../utils/types/account/account';
import { ZForbidden } from '../../../utils/types/errors/forbidden';
import { ZInternalServerError } from '../../../utils/types/errors/internal-server-error';
import { ZNotFound } from '../../../utils/types/errors/not-found';
import { ZUnauthorized } from '../../../utils/types/errors/unauthorized';
import { ZUserIdFromParam } from '../../../utils/types/user/user-id-from-param';
import { authorizeOwnerOrAdminByUserIdParam } from '../../middlewares/authorize-by-user-id-param';
import { verifyJwt } from '../../middlewares/verify-jwt';
import { getAccount } from './get-account-by-user-id.controller';

export async function accountRoutes(app: FastifyTypedInstance) {
    app.get('/account/:userId',
        {
            onRequest: [verifyJwt, authorizeOwnerOrAdminByUserIdParam],
            schema: {
                description: 'Get Account',
                tags: ['Account'],
                security: [{ BearerAuth: [] }],
                params: ZUserIdFromParam,
                response: {
                    200: ZAccount,
                    401: ZUnauthorized,
                    403: ZForbidden,
                    404: ZNotFound,
                    500: ZInternalServerError
                }
            }
        },
        getAccount
    );
}