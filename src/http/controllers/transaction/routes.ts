import { FastifyTypedInstance } from '../../../@types/fastify-type';
import { BadRequestSchema } from '../../../utils/schemas/errors/bad-request-schema';
import { InternalServerErrorSchema } from '../../../utils/schemas/errors/internal-server-error-schema';
import { UnauthorizedSchema } from '../../../utils/schemas/errors/unauthorized-schema';
import { CreatedSchema } from '../../../utils/schemas/default-responses/created-schema';
import { ForbiddenSchema } from '../../../utils/schemas/errors/forbidden-schema';
import { createTransaction } from './create-transaction.controller';
import { verifyJwt } from '../../../http/middlewares/verify-jwt';
import { TransactionCreateSchema } from '../../../utils/schemas/transactions/create-transaction-schema';
import { FindManyTransactionsRequestSchema, FindManyTransactionsResponseSchema } from '../../../utils/schemas/transactions/find-many-transactions-schema';
import { findManyPaginatedTransactions } from './find-many-paginated-transactions.controller';
import { authorizeOwnerOrAdminByAccountIdParam } from '../../../http/middlewares/authorize-by-account-id-param';
import { NotFoundSchema } from '../../../utils/schemas/errors/not-found-schema';
import { authorizeOwnerOrAdminByAccountIdBody } from '../../../http/middlewares/authorize-by-account-id-body';
import { deleteTransaction } from './delete-transaction.controller';
import { DeleteTransactionResponseZod, DeleteTransactionZod } from '../../../utils/schemas/transactions/delete-transaction';
import { AccountIdParamZod } from '../../../utils/schemas/account-id-param';
import { FindManyInPeriodTransactionsZod } from '../../../utils/schemas/transactions/find-many-in-period-transactions-schema';
import { findManyTransactionsInPeriod } from './find-many-transactions-in-period.controller';

export async function transactionRoutes(app: FastifyTypedInstance) {
    app.post('/transaction',
        {
            onRequest: [verifyJwt],
            preHandler: [authorizeOwnerOrAdminByAccountIdBody],
            schema: {
                description: 'Create Transaction',
                tags: ['Transaction'],
                security: [{ BearerAuth: [] }],
                body: TransactionCreateSchema,
                response: {
                    201: CreatedSchema.describe('Transaction Created'),
                    400: BadRequestSchema,
                    401: UnauthorizedSchema,
                    403: ForbiddenSchema,
                    500: InternalServerErrorSchema
                }
            }
        },
        createTransaction
    );

    app.get('/transaction/:accountId',
        {
            onRequest: [verifyJwt, authorizeOwnerOrAdminByAccountIdParam],
            schema: {
                description: 'Find many transactions',
                tags: ['Transaction'],
                security: [{ BearerAuth: [] }],
                params: AccountIdParamZod,
                querystring: FindManyTransactionsRequestSchema,
                response: {
                    200: FindManyTransactionsResponseSchema.describe('Finded many transactions'),
                    400: BadRequestSchema,
                    401: UnauthorizedSchema,
                    403: ForbiddenSchema,
                    404: NotFoundSchema.describe('Account Not Found'),
                    500: InternalServerErrorSchema
                }
            }
        },
        findManyPaginatedTransactions
    );

    app.get('/transaction/period/:accountId',
        {
            onRequest: [verifyJwt, authorizeOwnerOrAdminByAccountIdParam],
            schema: {
                description: 'Find many transactions',
                tags: ['Transaction'],
                security: [{ BearerAuth: [] }],
                params: AccountIdParamZod,
                querystring: FindManyInPeriodTransactionsZod,
                response: {
                    200: FindManyTransactionsResponseSchema.describe('Finded many transactions in period'),
                    400: BadRequestSchema,
                    401: UnauthorizedSchema,
                    403: ForbiddenSchema,
                    404: NotFoundSchema.describe('Account Not Found'),
                    500: InternalServerErrorSchema
                }
            }
        },
        findManyTransactionsInPeriod
    );

    app.delete('/transaction/:accountId/:transactionId',
        {
            onRequest: [verifyJwt, authorizeOwnerOrAdminByAccountIdParam],
            schema: {
                description: 'Delete transaction',
                tags: ['Transaction'],
                security: [{ BearerAuth: [] }],
                params: DeleteTransactionZod,
                response: {
                    200: DeleteTransactionResponseZod,
                    400: BadRequestSchema,
                    401: UnauthorizedSchema,
                    403: ForbiddenSchema,
                    404: NotFoundSchema.describe('Account Not Found'),
                    500: InternalServerErrorSchema
                }
            }
        },
        deleteTransaction
    );
}