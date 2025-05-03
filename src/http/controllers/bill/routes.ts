import { FastifyTypedInstance } from '../../../@types/fastify-type';
import { verifyJwt } from '../../middlewares/verify-jwt';
import { createBill } from './create-bill.controller';
import { CreatedSchema } from '../../../utils/schemas/responses/default-responses/created.schema';
import { BadRequestSchema } from '../../../utils/schemas/responses/errors/bad-request.schema';
import { ForbiddenSchema } from '../../../utils/schemas/responses/errors/forbidden.schema';
import { InternalServerErrorSchema } from '../../../utils/schemas/responses/errors/internal-server-error.schema';
import { UnauthorizedSchema } from '../../../utils/schemas/responses/errors/unauthorized.schema';
import { getPaginatedBills } from './get-paginated-bills.controller';
import { authorizeOwnerOrAdminByAccountIdParam } from '../../middlewares/authorize-by-account-id-param';
import { CreateBillBody } from '../../../utils/schemas/request/bills/create-bill.schema';
import { authorizeOwnerOrAdminByAccountIdBody } from '../../middlewares/authorize-by-account-id-body';
import { AccountIdParam } from '../../../utils/schemas/request/account/account-id-param.schema';
import { deleteBill } from './delete-bill.controller';
import { NotFoundSchema } from '../../../utils/schemas/responses/errors/not-found.schema';
import { DeleteBillParam } from '../../../utils/schemas/request/bills/delete-bill.schema';
import { DeletedSchemaZod } from '../../../utils/schemas/responses/default-responses/deleted.schema';
import { ConflictSchema } from '../../../utils/schemas/responses/errors/conflict.schema';
import { PayInvoiceBody } from '../../../utils/schemas/request/bills/pay-invoice.schema';
import { payInvoice } from './pay-invoice.controller';
import { GetPaginatedBillsQuery } from '../../../utils/schemas/request/bills/get-paginated-bills.schema';
import { GetPaginatedBillsResponse } from '../../../utils/schemas/responses/bills/get-paginated-bills.schema';
import { GetBillsInPeriodQuery } from '../../../utils/schemas/request/bills/get-bills-in-period.schema';
import { getBillsInPeriod } from './get-bills-in-period.controller';

export async function billRoutes(app: FastifyTypedInstance) {
    app.post('/bill',
        {
            onRequest: [verifyJwt],
            preHandler: [authorizeOwnerOrAdminByAccountIdBody],
            schema: {
                description: 'Create Bill',
                tags: ['Bill'],
                security: [{ BearerAuth: [] }],
                body: CreateBillBody.describe('Create Bill Payload'),
                response: {
                    201: CreatedSchema.describe('Bill Created'),
                    400: BadRequestSchema,
                    401: UnauthorizedSchema,
                    403: ForbiddenSchema,
                    500: InternalServerErrorSchema
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
                params: AccountIdParam,
                querystring: GetPaginatedBillsQuery.describe('Create Bill Payload'),
                response: {
                    200: GetPaginatedBillsResponse.describe('Finded Many Bills'),
                    400: BadRequestSchema,
                    401: UnauthorizedSchema,
                    403: ForbiddenSchema,
                    500: InternalServerErrorSchema
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
                params: AccountIdParam,
                querystring: GetBillsInPeriodQuery.describe('Get bills in period'),
                response: {
                    200: GetPaginatedBillsResponse.describe('Finded Many Bills'),
                    400: BadRequestSchema,
                    401: UnauthorizedSchema,
                    403: ForbiddenSchema,
                    500: InternalServerErrorSchema
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
                params: DeleteBillParam,
                response: {
                    200: DeletedSchemaZod,
                    400: BadRequestSchema,
                    401: UnauthorizedSchema,
                    403: ForbiddenSchema,
                    404: NotFoundSchema.describe('Account Not Found'),
                    500: InternalServerErrorSchema
                }
            }
        },
        deleteBill
    );

    app.post('/invoice/bill',
        {
            onRequest: [verifyJwt],
            preHandler: [authorizeOwnerOrAdminByAccountIdBody],
            schema: {
                description: 'Pay invoice',
                tags: ['Bill'],
                security: [{ BearerAuth: [] }],
                body: PayInvoiceBody,
                response: {
                    200: CreatedSchema,
                    400: BadRequestSchema,
                    401: UnauthorizedSchema,
                    403: ForbiddenSchema,
                    404: NotFoundSchema.describe('Account or bill Not Found'),
                    409: ConflictSchema,
                    500: InternalServerErrorSchema
                }
            }
        },
        payInvoice
    );
}