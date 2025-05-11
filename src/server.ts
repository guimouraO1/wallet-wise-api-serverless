import cluster from 'cluster';
import os from 'os';
import app from './app';
import { env } from './utils/libs/env';

const workersMap: { [key: string]: number } = {};

function createWorker(workerId: number) {
    const worker = cluster.fork({ workerId: workerId.toString() });
    workersMap[worker.id] = workerId;
}

function generateWorkers() {
    const cpuCount = os.cpus().length;
    for (let i = 0; i < cpuCount; i++) {
        createWorker(i + 1);
    }

    cluster.on('exit', (worker) => {
        const workerId = workersMap[worker.id];
        delete workersMap[worker.id];
        createWorker(workerId);
    });
}

async function startHttpServer() {
    try {
        await app.listen({ host: '0.0.0.0', port: +env.PORT || 3000 });
        console.log(`🚀 HTTP Server is listening on port: ${env.PORT || 3000}`);
    } catch (error) {
        console.error('Error starting server:', error);
    }
}

async function startServers() {
    if (cluster.isPrimary) {
        generateWorkers();
    } else {
        await startHttpServer();
    }
}

startServers().catch((err) => {
    console.error('Error starting servers:', err);
});