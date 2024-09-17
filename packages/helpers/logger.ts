import winston from "winston";

class Logger {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json(),
        winston.format.simple(),
        winston.format.printf(({ level, message }) => {
          return `${level}: ${message}`;
        })
      ),
      level: "info",
      transports: [new winston.transports.Console()]
    });
  }

  error(message: string, error?: Error | unknown) {
    this.logger.error(message, error);
  }

  info(message: string) {
    this.logger.info(message);
  }

  warn(message: string, error?: Error | unknown) {
    this.logger.warn(message, error);
  }
}

const logger = new Logger();

export default logger;
