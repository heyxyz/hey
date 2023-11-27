import * as dotenv from 'dotenv';
import express from 'express';
import { router } from 'express-file-routing';
import http from 'http';

dotenv.config({ override: true });

const app = express().use(express.json()).use('/', router());

const httpPort = 4785;
http.createServer(app).listen(httpPort, () => {
  console.log(`Server listening on port ${httpPort}`);
});
