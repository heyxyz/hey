class Logger {
  private formatMessage(level: string, message: string, colorCode: string) {
    return `\x1b[${colorCode}m${level}\x1b[0m: ${message}`;
  }

  error(message: string) {
    const formattedMessage = this.formatMessage('ERROR', message, '1;31');
    console.error(formattedMessage);
  }

  info(message: string) {
    const formattedMessage = this.formatMessage('INFO', message, '1;34');
    console.log(formattedMessage);
  }
}

const logger = new Logger();

export default logger;
