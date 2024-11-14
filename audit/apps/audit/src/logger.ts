import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: process.env.LEVEL ?? 'error',
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.simple(),
    })
  );
}

export default logger;
