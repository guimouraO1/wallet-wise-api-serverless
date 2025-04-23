// import * as winston from 'winston';
// import DailyRotateFile from 'winston-daily-rotate-file';
// import path from 'path';

// const logDirectory = path.join(__dirname, '../../log');

// winston.addColors({ error: 'red', warn: 'yellow', info: 'blue' });

// const consoleFormat = winston.format.printf(({ level, message, timestamp }) => {
//     const levelColorized = winston.format.colorize().colorize(level, `${timestamp} - [${level.toUpperCase()}]:`);
//     return `${levelColorized} ${message}`;
// });

// const fileFormat = winston.format.combine(
//     winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
//     winston.format.printf(({ level, message, timestamp }) => {
//         return `${timestamp} - [${level.toUpperCase()}]: ${message}`;
//     })
// );

// const logger = winston.createLogger({
//     level: 'info',
//     format: fileFormat,
//     transports: [
//         new DailyRotateFile({
//             level: 'info',
//             filename: path.join(logDirectory, 'info.%DATE%.log'),
//             datePattern: 'YYYY-MM-DD',
//             maxSize: '10m',
//             format: fileFormat
//         }),
//         new DailyRotateFile({
//             level: 'error',
//             filename: path.join(logDirectory, 'exceptions.%DATE%.log'),
//             datePattern: 'YYYY-MM-DD',
//             maxSize: '10m',
//             format: fileFormat
//         }),
//         new winston.transports.Console({
//             level: 'debug',
//             format: consoleFormat
//         })
//     ],
//     exceptionHandlers: [
//         new winston.transports.Console({
//             format: consoleFormat
//         }),
//         new DailyRotateFile({
//             filename: path.join(logDirectory, 'exceptions.%DATE%.log'),
//             datePattern: 'YYYY-MM-DD',
//             maxSize: '10m',
//             format: fileFormat
//         })
//     ],
//     exitOnError: false
// });

// // export default logger;
