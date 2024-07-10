import logger from '@hey/helpers/logger';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { router } from 'express-file-routing';
import ViteExpress from 'vite-express';

import limitDomains from './helpers/middlewares/limitDomains';

// Load environment variables
dotenv.config({ override: true });

const app = express();

app.disable('x-powered-by');

// Middleware configuration
app.use(cors());
// app.use(limitDomains);
app.use(express.json({ limit: '1mb' }));

//  Increase request timeout
app.use((req, _, next) => {
  req.setTimeout(120000); // 2 minutes
  next();
});

// Log request aborted
app.use((req, _, next) => {
  req.on('aborted', () => {
    logger.error('Request aborted by the client');
  });
  next();
});

const setupRoutes = async () => {
  // Route configuration
  app.use('/', await router());

  // Start the server
  ViteExpress.listen(app, 4784, () => {
    logger.info('Server is listening on port 4784...');
  });
};

// Initialize routes
setupRoutes().catch((error) => {
  logger.error('Error setting up routes', error);
});
