import '../instrument.mjs';

// eslint-disable-next-line perfectionist/sort-imports
import logger from '@hey/helpers/logger';
import * as Sentry from '@sentry/node';
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

// Setup Sentry
Sentry.setupExpressErrorHandler(app);

const setupRoutes = async () => {
  // Route configuration
  app.use('/signup', express.raw({ type: 'application/json' }), await router());
  app.use('/', express.json({ limit: '1mb' }), await router());

  // Start the server
  ViteExpress.listen(app, 4784, () => {
    logger.info('Server is listening on port 4784...');
  });
};

// Initialize routes
setupRoutes().catch(() => {
  logger.error('Error setting up routes');
});
