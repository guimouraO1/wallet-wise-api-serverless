import { FastifyTypedInstance } from '../../../@types/fastify-type';
import { signIn } from './sign-in.controller';
import { refreshToken } from './refresh-token.controller';
import { signOut } from './sign-out.controller';
import { AuthenticateRequestBodyZod } from '../../../utils/schemas/auth/sign-in.schema';
import { SignOutResponseSchema } from '../../../utils/schemas/auth/sign-out-schema';
import { BadRequestSchema } from '../../../utils/schemas/errors/bad-request-schema';
import { InternalServerErrorSchema } from '../../../utils/schemas/errors/internal-server-error-schema';
import { UnauthorizedSchema } from '../../../utils/schemas/errors/unauthorized-schema';
import { TokenResponseSchema } from '../../../utils/schemas/token-schema';

export async function authRoutes(app: FastifyTypedInstance) {
    app.post('/sign-in',
        {
            schema: {
                description: 'Sign In',
                tags: ['Auth'],
                body: AuthenticateRequestBodyZod,
                response: {
                    200: TokenResponseSchema.describe('Authenticated'),
                    400: BadRequestSchema,
                    401: UnauthorizedSchema,
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
                    200: SignOutResponseSchema,
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