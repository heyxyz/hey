import DatadogWinston from 'datadog-winston';
import dotenv from 'dotenv';
import winston from 'winston';

dotenv.config({ override: true });

class Logger {
  private logger: winston.Logger;

  constructor() {
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
      transports: [new winston.transports.Console()]
    });

    const datadogApiKey = process.env.DATADOG_API_KEY;
    if (datadogApiKey) {
      this.logger.add(
        new DatadogWinston({ apiKey: datadogApiKey, intakeRegion: 'eu' })
      );
    }
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
