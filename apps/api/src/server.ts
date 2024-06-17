import logger from '@good/helpers/logger';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { router } from 'express-file-routing';
import ViteExpress from 'vite-express';

// Load environment variables
dotenv.config({ override: true });

const app = express();

// Middleware configuration
app.use(cors());
app.disable('x-powered-by');

const setupRoutes = async () => {
  // Route configuration
  app.use('/', express.json({ limit: '1mb' }), await router());

  // Start the server
  ViteExpress.listen(app, 4784, () => {
    logger.info('Server is listening on port 4784...');
  });
};

// Initialize routes
setupRoutes().catch((error) => {
  logger.error('Error setting up routes', error);
});
