import { WinstonTransport as AxiomTransport } from '@axiomhq/winston';
import dotenv from 'dotenv';
import winston from 'winston';

dotenv.config({ override: true });

class Logger {
  private logger: winston.Logger;

  constructor() {
    const transports: winston.transport[] = [new winston.transports.Console()];

    const axiomToken = process.env.AXIOM_TOKEN;
    if (axiomToken) {
      transports.push(
        new AxiomTransport({ dataset: 'hey', token: axiomToken })
      );
    }

    this.logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json(),
        winston.format.timestamp(),
        winston.format.printf(({ level, message }) => {
          return `${level}: ${message}`;
        })
      ),
      level: 'info',
      transports: transports
    });
  }

  error(message: string, error?: Error) {
    this.logger.error(message, error);
  }

  info(message: string) {
    this.logger.info(message);
  }
}

const logger = new Logger();

export default logger;
