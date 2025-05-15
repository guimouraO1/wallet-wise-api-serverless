import { FastifyTypedInstance } from '../../../@types/fastify-type';
import { ZSignIn } from '../../../utils/types/auth/sign-in';
import { ZTokenObject } from '../../../utils/types/auth/token';
import { ZBadRequest } from '../../../utils/types/errors/bad-request';
import { ZInternalServerError } from '../../../utils/types/errors/internal-server-error';
import { ZNotFound } from '../../../utils/types/errors/not-found';
import { ZUnauthorized } from '../../../utils/types/errors/unauthorized';
import { ZObjectVoid } from '../../../utils/types/others/object-void';
import { refreshToken } from './refresh-token.controller';
import { signIn } from './sign-in.controller';
import { signOut } from './sign-out.controller';

export async function authRoutes(app: FastifyTypedInstance) {
    app.post('/sign-in',
        {
            schema: {
                description: 'Sign In',
                tags: ['Auth'],
                body: ZSignIn,
                response: {
                    200: ZTokenObject.describe('Successfully Sign-in'),
                    400: ZBadRequest,
                    401: ZUnauthorized,
                    404: ZNotFound,
                    500: ZInternalServerError
                }
            }
        },
        signIn
    );

    app.post('/sign-out',
        {
            schema: {
                description: 'Sign out',
                tags: ['Auth'],
                response: {
                    200: ZObjectVoid.describe('Successfully sign-out'),
                    401: ZUnauthorized,
                    500: ZInternalServerError
                }
            }
        },
        signOut
    );

    app.post('/refresh-token',
        {
            schema: {
                description: 'Refresh token',
                tags: ['Auth'],
                response: {
                    200: ZTokenObject.describe('Successfully refresh token'),
                    401: ZUnauthorized,
                    500: ZInternalServerError
                }
            }
        },
        refreshToken
    );
}