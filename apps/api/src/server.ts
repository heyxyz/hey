import logger from "@hey/helpers/logger";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { router } from "express-file-routing";

// Load environment variables
dotenv.config({ override: true });

const app = express();

app.disable("x-powered-by");

// Middleware configuration
app.use(cors());
app.use(express.json({ limit: "1mb" }));

//  Increase request timeout
app.use((req, _, next) => {
  req.setTimeout(120000); // 2 minutes
  next();
});

// Log request aborted
app.use((req, _, next) => {
  req.on("aborted", () => {
    logger.error("Request aborted by the client");
  });
  next();
});

const startServer = async () => {
  // Route configuration
  app.use("/", await router());

  // Catch all valid pages that don't match any route and send custom 404
  app.use((_, res) => {
    res.status(404).json({ message: "404", success: false });
  });

  // Start the server
  app.listen(4784, () => {
    logger.info("Server is listening on port 4784...");
  });
};

// Initialize routes
startServer().catch((error) => {
  logger.error("Failed to start API server", error);
});
