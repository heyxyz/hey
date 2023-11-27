import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import { router } from 'express-file-routing';
import ViteExpress from 'vite-express';

dotenv.config({ override: true });

const app = express().use(cors()).use(express.json()).use('/', router());

ViteExpress.listen(app, 4785, () =>
  console.log('Server is listening on port 4785...')
);
