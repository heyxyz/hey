import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import { router } from 'express-file-routing';
import ViteExpress from 'vite-express';

dotenv.config({ override: true });

const app = express();

app.use(express.json({ limit: '1mb' }));
app.use(cors());

(async () => {
  app.use('/', await router());

  ViteExpress.listen(app, 4785, () =>
    console.log('Server is listening on port 4785...')
  );
})();
