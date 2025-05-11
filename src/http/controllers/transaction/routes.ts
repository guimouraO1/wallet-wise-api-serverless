import { FastifyTypedInstance } from '../../../@types/fastify-type';
import { BadRequestSchema } from '../../../utils/schemas/responses/errors/bad-request.schema';
import { InternalServerErrorSchema } from '../../../utils/schemas/responses/errors/internal-server-error.schema';
import { UnauthorizedSchema } from '../../../utils/schemas/responses/errors/unauthorized.schema';
import { CreatedSchema } from '../../../utils/schemas/responses/default-responses/created.schema';
import { ForbiddenSchema } from '../../../utils/schemas/responses/errors/forbidden.schema';
import { createTransaction } from './create-transaction.controller';
import { verifyJwt } from '../../middlewares/verify-jwt';
import { CreateTransactionBody } from '../../../utils/schemas/request/transactions/create-transaction.schema';
import { GetPaginatedTransactionsQuery }
    from '../../../utils/schemas/request/transactions/get-paginated-transactions.schema';
import { getPaginatedTransactions } from './get-paginated-transactions.controller';
import { authorizeOwnerOrAdminByAccountIdParam } from '../../middlewares/authorize-by-account-id-param';
import { NotFoundSchema } from '../../../utils/schemas/responses/errors/not-found.schema';
import { authorizeOwnerOrAdminByAccountIdBody } from '../../middlewares/authorize-by-account-id-body';
import { deleteTransaction } from './delete-transaction.controller';
import { DeleteTransactionParams } from '../../../utils/schemas/request/transactions/delete-transaction.schema';
import { AccountIdParam } from '../../../utils/schemas/request/account/account-id-param.schema';
import { GetTransactionsInPeriodQuery } from '../../../utils/schemas/request/transactions/get-transactions-in-period.schema';
import { getTransactionsInPeriod } from './get-transactions-in-period.controller';
import { GetPaginatedTransactionsResponse } from '../../../utils/schemas/responses/transactions/get-paginated-transactions.schema';
import { DeleteTransactionResponse } from '../../../utils/schemas/responses/transactions/delete-transaction.schema';
import { UnprocessableEntity } from '../../../utils/schemas/responses/errors/unprocessable-entity.schema';
import { getTransactionsSummary } from './get-transactions-summary.controller';
import { GetTransactionsSummaryResponse } from
    '../../../utils/schemas/responses/transactions/get-transactions-summary.schema';
import { GetTransactionsSummaryRequest }
    from '../../../utils/schemas/request/transactions/get-transactions-summary.schema';

export async function transactionRoutes(app: FastifyTypedInstance) {
    app.post('/transaction',
        {
            onRequest: [verifyJwt],
            preHandler: [authorizeOwnerOrAdminByAccountIdBody],
            schema: {
                description: 'Create Transaction',
                tags: ['Transaction'],
                security: [{ BearerAuth: [] }],
                body: CreateTransactionBody,
                response: {
                    201: CreatedSchema.describe('Transaction Created'),
                    400: BadRequestSchema,
                    401: UnauthorizedSchema,
                    403: ForbiddenSchema,
                    422: UnprocessableEntity,
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
                params: AccountIdParam,
                querystring: GetPaginatedTransactionsQuery,
                response: {
                    200: GetPaginatedTransactionsResponse.describe('Finded many transactions'),
                    400: BadRequestSchema,
                    401: UnauthorizedSchema,
                    403: ForbiddenSchema,
                    404: NotFoundSchema.describe('Account Not Found'),
                    500: InternalServerErrorSchema
                }
            }
        },
        getPaginatedTransactions
    );

    app.get('/transaction/period/:accountId',
        {
            onRequest: [verifyJwt, authorizeOwnerOrAdminByAccountIdParam],
            schema: {
                description: 'Find many transactions',
                tags: ['Transaction'],
                security: [{ BearerAuth: [] }],
                params: AccountIdParam,
                querystring: GetTransactionsInPeriodQuery,
                response: {
                    200: GetPaginatedTransactionsResponse.describe('Finded many transactions in period'),
                    400: BadRequestSchema,
                    401: UnauthorizedSchema,
                    403: ForbiddenSchema,
                    404: NotFoundSchema.describe('Account Not Found'),
                    500: InternalServerErrorSchema
                }
            }
        },
        getTransactionsInPeriod
    );

    app.get('/transaction/year/:accountId',
        {
            onRequest: [verifyJwt, authorizeOwnerOrAdminByAccountIdParam],
            schema: {
                description: 'Find transactions by year',
                tags: ['Transaction'],
                security: [{ BearerAuth: [] }],
                params: AccountIdParam,
                querystring: GetTransactionsSummaryRequest,
                response: {
                    200: GetTransactionsSummaryResponse.describe('Finded many transactions in YEAR'),
                    400: BadRequestSchema,
                    401: UnauthorizedSchema,
                    403: ForbiddenSchema,
                    404: NotFoundSchema.describe('Account Not Found'),
                    500: InternalServerErrorSchema
                }
            }
        },
        getTransactionsSummary
    );

    app.delete('/transaction/:accountId/:transactionId',
        {
            onRequest: [verifyJwt, authorizeOwnerOrAdminByAccountIdParam],
            schema: {
                description: 'Delete transaction',
                tags: ['Transaction'],
                security: [{ BearerAuth: [] }],
                params: DeleteTransactionParams,
                response: {
                    200: DeleteTransactionResponse,
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