import { jsonSchemaTransform } from 'fastify-type-provider-zod';
import { env } from '../libs/env';

export const fastifySwaggerConfig = {
    openapi: {
        info: {
            title: 'Manga nest Api',
            version: '1.0.0'
        },
        // servers: [
        //     {
        //         url: `http://localhost:${env.PORT}`,
        //         description: 'Development server'
        //     }
        // ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http' as const,
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    transform: jsonSchemaTransform
};