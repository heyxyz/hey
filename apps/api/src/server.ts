import compression from 'compression';
import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import { router } from 'express-file-routing';
import { rateLimit } from 'express-rate-limit';
import ViteExpress from 'vite-express';

dotenv.config({ override: true });

const app = express();

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 200, // Limit each IP to 200 requests per `window`
  standardHeaders: 'draft-7',
  legacyHeaders: false
});

app.use(express.json({ limit: '1mb' }));
app.use(cors());
app.use(compression());
app.use(limiter);

(async () => {
  app.use('/', await router());

  ViteExpress.listen(app, 4785, () =>
    console.log('Server is listening on port 4785...')
  );
})();
