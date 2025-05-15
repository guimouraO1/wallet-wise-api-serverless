import { FastifyTypedInstance } from '../../../@types/fastify-type';
import { ZBadRequest } from '../../../utils/types/errors/bad-request';
import { ZConflict } from '../../../utils/types/errors/conflict';
import { ZForbidden } from '../../../utils/types/errors/forbidden';
import { ZInternalServerError } from '../../../utils/types/errors/internal-server-error';
import { ZNotFound } from '../../../utils/types/errors/not-found';
import { ZUnauthorized } from '../../../utils/types/errors/unauthorized';
import { ZObjectVoid } from '../../../utils/types/others/object-void';
import { ZCreateUser } from '../../../utils/types/user/create-user';
import { ZUser } from '../../../utils/types/user/user';
import { ZUserIdFromParam } from '../../../utils/types/user/user-id-from-param';
import { authorizeAdminOnly } from '../../middlewares/authorize-admin-only';
import { authorizeOwnerOrAdminByUserIdParam } from '../../middlewares/authorize-by-user-id-param';
import { verifyJwt } from '../../middlewares/verify-jwt';
import { createUser } from './create-user.controller';
import { getUserById } from './get-user-by-id.controller';

export async function userRoutes(app: FastifyTypedInstance) {
    app.post('/user',
        {
            onRequest: [verifyJwt, authorizeAdminOnly],
            schema: {
                description: 'Create User',
                tags: ['User'],
                security: [{ BearerAuth: [] }],
                body: ZCreateUser,
                response: {
                    201: ZObjectVoid.describe('User Created'),
                    400: ZBadRequest,
                    401: ZUnauthorized,
                    403: ZForbidden,
                    409: ZConflict,
                    500: ZInternalServerError
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
                params: ZUserIdFromParam,
                response: {
                    200: ZUser.describe('User Founded'),
                    400: ZBadRequest,
                    401: ZUnauthorized,
                    403: ZForbidden,
                    404: ZNotFound.describe('User Not Found'),
                    500: ZInternalServerError
                }
            }
        },
        getUserById
    );
}