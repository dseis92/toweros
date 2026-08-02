/**
 * Structured Logging with Pino
 *
 * Production-ready logger with:
 * - Structured JSON logs
 * - Request ID tracking
 * - Performance metrics
 * - Pretty printing (development)
 */

import pino from 'pino';
import { config } from '../config';

/**
 * Create Pino logger instance
 */
export const logger = pino({
  level: config.logging.level,
  ...(config.logging.pretty && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  }),
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      headers: {
        host: req.headers.host,
        userAgent: req.headers['user-agent'],
      },
      remoteAddress: req.ip,
      remotePort: req.socket?.remotePort,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
    err: pino.stdSerializers.err,
  },
});

/**
 * Create child logger with context
 */
export function createLogger(context: Record<string, unknown>) {
  return logger.child(context);
}
