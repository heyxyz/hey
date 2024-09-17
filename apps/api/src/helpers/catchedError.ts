import type { Response } from "express";

import logger from "@hey/helpers/logger";

const catchedError = (res: Response, error: any, status?: number) => {
  const statusCode = status || 500;
  logger.error(error);

  return res.status(statusCode).json({
    error: statusCode < 500 ? "client_error" : "server_error",
    message: error.message,
    success: false
  });
};

export default catchedError;
