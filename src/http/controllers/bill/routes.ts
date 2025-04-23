import { FastifyTypedInstance } from '../../../@types/fastify-type';
import { verifyJwt } from '../../../http/middlewares/verify-jwt';
import { createBill } from './create-bill.controller';
import { FindManyBillsInputZod, FindManyBillsResponseZod } from '../../../utils/schemas/bills/find-many-bills-schema';
import { CreatedSchema } from '../../../utils/schemas/default-responses/created-schema';
import { BadRequestSchema } from '../../../utils/schemas/errors/bad-request-schema';
import { ForbiddenSchema } from '../../../utils/schemas/errors/forbidden-schema';
import { InternalServerErrorSchema } from '../../../utils/schemas/errors/internal-server-error-schema';
import { UnauthorizedSchema } from '../../../utils/schemas/errors/unauthorized-schema';
import { findManyPaginatedBills } from './find-many-paginated-bills.controller';
import { authorizeOwnerOrAdminByAccountIdParam } from '../../../http/middlewares/authorize-by-account-id-param';
import { BillCreateInputZod } from '../../../utils/schemas/bills/create-bill-schema';
import { authorizeOwnerOrAdminByAccountIdBody } from '../../../http/middlewares/authorize-by-account-id-body';
import { AccountIdParamZod } from '../../../utils/schemas/account-id-param';
import { deleteBill } from './delete-bill.controller';
import { NotFoundSchema } from '../../../utils/schemas/errors/not-found-schema';
import { DeleteBillZod } from '../../../utils/schemas/bills/delete-bill';
import { DeletedSchemaZod } from '../../../utils/schemas/default-responses/deleted-schema';
import { ConflictSchema } from '../../../utils/schemas/errors/conflict-schema';
import { PayInvoiceZod } from '../../../utils/schemas/bills/pay-invoice';
import { payInvoice } from './pay-invoice.controller';

export async function billRoutes(app: FastifyTypedInstance) {
    app.post('/bill',
        {
            onRequest: [verifyJwt],
            preHandler: [authorizeOwnerOrAdminByAccountIdBody],
            schema: {
                description: 'Create Bill',
                tags: ['Bill'],
                security: [{ BearerAuth: [] }],
                body: BillCreateInputZod.describe('Create Bill Payload'),
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
                params: AccountIdParamZod,
                querystring: FindManyBillsInputZod.describe('Create Bill Payload'),
                response: {
                    200: FindManyBillsResponseZod.describe('Finded Many Bills'),
                    400: BadRequestSchema,
                    401: UnauthorizedSchema,
                    403: ForbiddenSchema,
                    500: InternalServerErrorSchema
                }
            }
        },
        findManyPaginatedBills
    );

    app.delete('/bill/:accountId/:id',
        {
            onRequest: [verifyJwt, authorizeOwnerOrAdminByAccountIdParam],
            schema: {
                description: 'Delete Bill',
                tags: ['Bill'],
                security: [{ BearerAuth: [] }],
                params: DeleteBillZod,
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
                body: PayInvoiceZod,
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