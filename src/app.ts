import { fastify } from 'fastify';
import { env } from './utils/libs/env';
import { fastifyJwt } from '@fastify/jwt';
import { fastifyCookie } from '@fastify/cookie';
import { fastifyCors } from '@fastify/cors';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import { authRoutes } from './http/controllers/auth/routes';
import { userRoutes } from './http/controllers/user/routes';
import { jwtConfig } from './utils/constants/jwt-config';
import { errorHandler } from './utils/error-handler';
import { accountRoutes } from './http/controllers/account/routes';
import { transactionRoutes } from './http/controllers/transaction/routes';
import { billRoutes } from './http/controllers/bill/routes';
import { fastifySwaggerConfig } from './utils/constants/fastify-swagger-config';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyJwt, jwtConfig);
app.register(fastifyCookie, { secret: env.COOKIE_SECRET });
app.register(fastifyCors, { origin: true, credentials: true });

app.register(fastifySwagger, fastifySwaggerConfig);
app.register(fastifySwaggerUi, { routePrefix: '/docs' });

app.register(authRoutes);
app.register(userRoutes);
app.register(accountRoutes);
app.register(transactionRoutes);
app.register(billRoutes);

app.setErrorHandler(errorHandler);

export default app;