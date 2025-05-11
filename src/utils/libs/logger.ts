import * as winston from 'winston';

winston.addColors({ error: 'red', warn: 'yellow', info: 'blue' });

const consoleFormat = winston.format.printf(({ level, message, timestamp }) => {
    const levelColorized = winston.format.colorize().colorize(level, `${timestamp} - [${level.toUpperCase()}]:`);
    return `${levelColorized} ${message}`;
});

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        consoleFormat
    ),
    transports: [
        new winston.transports.Console({
            format: consoleFormat
        })
    ],
    exceptionHandlers: [
        new winston.transports.Console({
            format: consoleFormat
        })
    ],
    exitOnError: false
});

export default logger;
