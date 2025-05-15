import { FastifyTypedInstance } from '../../../@types/fastify-type';
import { ZAccountIdFromParam } from '../../../utils/types/account/account-id-from-param';
import { ZBadRequest } from '../../../utils/types/errors/bad-request';
import { ZForbidden } from '../../../utils/types/errors/forbidden';
import { ZInternalServerError } from '../../../utils/types/errors/internal-server-error';
import { ZNotFound } from '../../../utils/types/errors/not-found';
import { ZUnauthorized } from '../../../utils/types/errors/unauthorized';
import { ZUnprocessableEntity } from '../../../utils/types/errors/unprocessable-entity';
import { ZObjectVoid } from '../../../utils/types/others/object-void';
import { ZCreateTransaction } from '../../../utils/types/transactions/create-transaction';
import { ZDeleteTransactionParams } from '../../../utils/types/transactions/delete-transaction';
import { ZGetPaginatedTransactions } from '../../../utils/types/transactions/get-paginated-transactions';
import { ZGetTransactionsResponse } from '../../../utils/types/transactions/get-transactions';
import { ZGetTransactionsInPeriod } from '../../../utils/types/transactions/get-transactions-in-period';
import { ZGetTransactionsSummary } from '../../../utils/types/transactions/get-transactions-summary-request';
import { ZGetTransactionsSummaryResponse } from '../../../utils/types/transactions/get-transactions-summary-response';
import { authorizeOwnerOrAdminByAccountIdBody } from '../../middlewares/authorize-by-account-id-body';
import { authorizeOwnerOrAdminByAccountIdParam } from '../../middlewares/authorize-by-account-id-param';
import { verifyJwt } from '../../middlewares/verify-jwt';
import { createTransaction } from './create-transaction.controller';
import { deleteTransaction } from './delete-transaction.controller';
import { getPaginatedTransactions } from './get-paginated-transactions.controller';
import { getTransactionsInPeriod } from './get-transactions-in-period.controller';
import { getTransactionsSummary } from './get-transactions-summary.controller';

export async function transactionRoutes(app: FastifyTypedInstance) {
    app.post('/transaction',
        {
            onRequest: [verifyJwt],
            preHandler: [authorizeOwnerOrAdminByAccountIdBody],
            schema: {
                description: 'Create Transaction',
                tags: ['Transaction'],
                security: [{ BearerAuth: [] }],
                body: ZCreateTransaction,
                response: {
                    201: ZObjectVoid.describe('Transaction Created'),
                    400: ZBadRequest,
                    401: ZUnauthorized,
                    403: ZForbidden,
                    422: ZUnprocessableEntity,
                    500: ZInternalServerError
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
                params: ZAccountIdFromParam,
                querystring: ZGetPaginatedTransactions,
                response: {
                    200: ZGetTransactionsResponse.describe('Finded many transactions'),
                    400: ZBadRequest,
                    401: ZUnauthorized,
                    403: ZForbidden,
                    404: ZNotFound.describe('Account Not Found'),
                    500: ZInternalServerError
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
                params: ZAccountIdFromParam,
                querystring: ZGetTransactionsInPeriod,
                response: {
                    200: ZGetTransactionsResponse.describe('Finded many transactions in period'),
                    400: ZBadRequest,
                    401: ZUnauthorized,
                    403: ZForbidden,
                    404: ZNotFound.describe('Account Not Found'),
                    500: ZInternalServerError
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
                params: ZAccountIdFromParam,
                querystring: ZGetTransactionsSummary,
                response: {
                    200: ZGetTransactionsSummaryResponse.describe('Finded many transactions in YEAR'),
                    400: ZBadRequest,
                    401: ZUnauthorized,
                    403: ZForbidden,
                    404: ZNotFound.describe('Account Not Found'),
                    500: ZInternalServerError
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
                params: ZDeleteTransactionParams,
                response: {
                    200: ZObjectVoid,
                    400: ZBadRequest,
                    401: ZUnauthorized,
                    403: ZForbidden,
                    404: ZNotFound.describe('Account Not Found'),
                    500: ZInternalServerError
                }
            }
        },
        deleteTransaction
    );
}