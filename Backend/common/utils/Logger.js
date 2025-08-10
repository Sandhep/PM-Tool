import winston from 'winston';
import 'winston-daily-rotate-file';
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';
import dotenv from 'dotenv';
dotenv.config();

class Logger { 
  constructor() {
    
    const logFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(
        ({ timestamp, level, message, stack }) =>
          `${timestamp} [${level.toUpperCase()}]: ${stack || message}`
      )
    );

    // File rotation transport
    const fileRotateTransport = new winston.transports.DailyRotateFile({
      dirname: 'logs',
      filename: 'app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'info'
    });

    const transports = [
      fileRotateTransport
    ];

    // Better Stack Logtail (Cloud Logging)
    if (process.env.CLOUD_LOGGING.match('Enable')) {
      const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN, {
        endpoint: process.env.LOGTAIL_HOST
      });
      transports.push(new LogtailTransport(logtail));
    }

    this.logger = winston.createLogger({
      level: 'info',
      format: logFormat,
      transports
    });
  }

  info(message) {
    this.logger.info(message);
  }

  error(message) {
    this.logger.error(message instanceof Error ? message.stack : message);
  }

  warn(message) {
    this.logger.warn(message);
  }

  debug(message) {
    this.logger.debug(message);
  }
}

export default new Logger();
