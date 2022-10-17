import dotenv from 'dotenv';
import type { Express, Request, Response } from 'express';
import express from 'express';

dotenv.config();

const app: Express = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Lenster API 🌸');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
