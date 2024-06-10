import logger from '@good/helpers/logger';
import exp from 'constants';
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
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

const setupRoutes = async () => {
  // Route configuration
  app.use('/signup', express.raw({ type: 'application/json' }), await router());
  app.use('/', express.json({ limit: '1mb' }), await router());

  // Start the server

  // ViteExpress.listen(app, 4784, () => {
  //   logger.info('Server is listening on port 4784...');
  // });
};

console.log('setting up routes');
(async () => await setupRoutes())();

console.log('listening');
app.listen(4784);

console.log('exporting');
export { app };
// Initialize routes
// setupRoutes().catch(() => {
//   logger.error('Error setting up routes');
// });
