import pino from 'pino';
import pretty from 'pino-pretty';

const logger = pino(
  pretty({ colorize: true, levelFirst: true, translateTime: 'SYS:standard' })
);

export default logger;
