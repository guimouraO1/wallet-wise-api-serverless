import { FastifyTypedInstance } from '../../../@types/fastify-type';
import { ZAccountIdFromParam } from '../../../utils/types/account/account-id-from-param';
import { ZCreateBillBody } from '../../../utils/types/bills/create-bill-body';
import { ZDeleteBillParams } from '../../../utils/types/bills/delete-bill';
import { ZGetBills } from '../../../utils/types/bills/get-bills';
import { ZGetBillsInPeriodQuery } from '../../../utils/types/bills/get-bills-in-period';
import { ZGetPaginatedBills } from '../../../utils/types/bills/get-paginated-bills';
import { ZPayBill } from '../../../utils/types/bills/pay-bill';
import { ZBadRequest } from '../../../utils/types/errors/bad-request';
import { ZConflict } from '../../../utils/types/errors/conflict';
import { ZForbidden } from '../../../utils/types/errors/forbidden';
import { ZInternalServerError } from '../../../utils/types/errors/internal-server-error';
import { ZNotFound } from '../../../utils/types/errors/not-found';
import { ZUnauthorized } from '../../../utils/types/errors/unauthorized';
import { ZObjectVoid } from '../../../utils/types/others/object-void';
import { authorizeOwnerOrAdminByAccountIdBody } from '../../middlewares/authorize-by-account-id-body';
import { authorizeOwnerOrAdminByAccountIdParam } from '../../middlewares/authorize-by-account-id-param';
import { verifyJwt } from '../../middlewares/verify-jwt';
import { createBill } from './create-bill.controller';
import { deleteBill } from './delete-bill.controller';
import { getBillsInPeriod } from './get-bills-in-period.controller';
import { getPaginatedBills } from './get-paginated-bills.controller';
import { payBill } from './pay-bill.controller';

export async function billRoutes(app: FastifyTypedInstance) {
    app.post('/bill',
        {
            onRequest: [verifyJwt],
            preHandler: [authorizeOwnerOrAdminByAccountIdBody],
            schema: {
                description: 'Create Bill',
                tags: ['Bill'],
                security: [{ BearerAuth: [] }],
                body: ZCreateBillBody.describe('Create Bill Payload'),
                response: {
                    201: ZObjectVoid.describe('Bill Created'),
                    400: ZBadRequest,
                    401: ZUnauthorized,
                    403: ZForbidden,
                    500: ZInternalServerError
                }
            }
        },
        createBill
    );

    app.get('/bill/:accountId',
        {
            onRequest: [verifyJwt, authorizeOwnerOrAdminByAccountIdParam],
            schema: {
                description: 'Find Many Paginated Bills',
                tags: ['Bill'],
                security: [{ BearerAuth: [] }],
                params: ZAccountIdFromParam,
                querystring: ZGetPaginatedBills.describe('Create Bill Payload'),
                response: {
                    200: ZGetBills.describe('Finded Many Bills'),
                    400: ZBadRequest,
                    401: ZUnauthorized,
                    403: ZForbidden,
                    500: ZInternalServerError
                }
            }
        },
        getPaginatedBills
    );

    app.get('/bill/period/:accountId',
        {
            onRequest: [verifyJwt, authorizeOwnerOrAdminByAccountIdParam],
            schema: {
                description: 'Get Bills in period',
                tags: ['Bill'],
                security: [{ BearerAuth: [] }],
                params: ZAccountIdFromParam,
                querystring: ZGetBillsInPeriodQuery.describe('Get bills in period'),
                response: {
                    200: ZGetBills.describe('Finded Many Bills'),
                    400: ZBadRequest,
                    401: ZUnauthorized,
                    403: ZForbidden,
                    500: ZInternalServerError
                }
            }
        },
        getBillsInPeriod
    );

    app.delete('/bill/:accountId/:id',
        {
            onRequest: [verifyJwt, authorizeOwnerOrAdminByAccountIdParam],
            schema: {
                description: 'Delete Bill',
                tags: ['Bill'],
                security: [{ BearerAuth: [] }],
                params: ZDeleteBillParams,
                response: {
                    201: ZObjectVoid.describe('Bill deleted'),
                    400: ZBadRequest,
                    401: ZUnauthorized,
                    403: ZForbidden,
                    404: ZNotFound.describe('Account Not Found'),
                    500: ZInternalServerError
                }
            }
        },
        deleteBill
    );

    app.post('/bill/pay/:accountId',
        {
            onRequest: [verifyJwt, authorizeOwnerOrAdminByAccountIdParam],
            schema: {
                description: 'Pay bill',
                tags: ['Bill'],
                security: [{ BearerAuth: [] }],
                body: ZPayBill,
                response: {
                    201: ZObjectVoid.describe('Bill paid'),
                    400: ZBadRequest,
                    401: ZUnauthorized,
                    403: ZForbidden,
                    404: ZNotFound.describe('Account or bill Not Found'),
                    409: ZConflict,
                    500: ZInternalServerError
                }
            }
        },
        payBill
    );
}