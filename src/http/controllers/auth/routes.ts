import { FastifyTypedInstance } from '../../../@types/fastify-type';
import { signIn } from './sign-in.controller';
import { refreshToken } from './refresh-token.controller';
import { signOut } from './sign-out.controller';
import { SignInBody } from '../../../utils/schemas/request/auth/sign-in.schema';
import { SignOutResponse } from '../../../utils/schemas/responses/auth/sign-out.schema';
import { BadRequestSchema } from '../../../utils/schemas/responses/errors/bad-request.schema';
import { InternalServerErrorSchema } from '../../../utils/schemas/responses/errors/internal-server-error.schema';
import { UnauthorizedSchema } from '../../../utils/schemas/responses/errors/unauthorized.schema';
import { TokenResponseSchema } from '../../../utils/schemas/responses/auth/token.schema';
import { NotFoundSchema } from '../../../utils/schemas/responses/errors/not-found.schema';

export async function authRoutes(app: FastifyTypedInstance) {
    app.post('/sign-in',
        {
            schema: {
                description: 'Sign In',
                tags: ['Auth'],
                body: SignInBody,
                response: {
                    200: TokenResponseSchema.describe('Successfully Sign-in'),
                    400: BadRequestSchema,
                    401: UnauthorizedSchema,
                    404: NotFoundSchema,
                    500: InternalServerErrorSchema
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
                    200: SignOutResponse.describe('Successfully sign-out'),
                    401: UnauthorizedSchema,
                    500: InternalServerErrorSchema
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
                    200: TokenResponseSchema.describe('Successfully refresh token'),
                    401: UnauthorizedSchema,
                    500: InternalServerErrorSchema
                }
            }
        },
        refreshToken
    );
}