import cors from 'cors';
import * as dotenv from 'dotenv';
import type { Request, Response } from 'express';
import express from 'express';

import resolveEns from './handlers/resolveEns';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_: Request, res: Response) => res.send('ENS service'));
app.get('/health', (_: Request, res: Response) => res.send('OK'));
app.post('/', resolveEns);

app.listen(5002, () => {
  console.log('Listening ENS service on 5002');
});
