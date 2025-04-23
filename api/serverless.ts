// api/serverless.ts
import app from '@/app';
import 'dotenv/config';
import 'tsconfig-paths/register';

export default async function handler(req: any, res: any) {
    await app.ready();
    app.server.emit('request', req, res);
}
