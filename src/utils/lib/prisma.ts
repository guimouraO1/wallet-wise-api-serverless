import { PrismaClient } from '@prisma/client';
import logger from './logger';

export const prisma = new PrismaClient({
    log: [{ emit: 'event', level: 'query' }]
});

prisma.$on('query', (event) => {
    logger.info(`${event.query}; Params: ${event.params} Duration: ${event.duration}ms`);
});