import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import type { Express, Request, Response } from 'express';
import express from 'express';

import upload from './upload';

dotenv.config();

const app: Express = express();
const port = 3000;

app.use(bodyParser.json({ type: 'application/json' }));

app.get('/', (req: Request, res: Response) => {
  res.send('Lenster API 🌸');
});

app.post('/upload', upload);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
