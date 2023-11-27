import compression from 'compression';
import * as dotenv from 'dotenv';
import express from 'express';
import { readFileSync } from 'fs';
import sirv from 'sirv';

dotenv.config();

const port = process.env.PORT || 4783;
const base = process.env.BASE || '/';

const app = express();

app.use(compression());
app.use(base, sirv('./dist/client', { extensions: [] }));

// Serve HTML
app.use('*', async (req, res) => {
  try {
    const html = readFileSync('./dist/client/index.html', 'utf-8');
    res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
  } catch (error) {
    console.log(error.stack);
    res.status(500).end(error.stack);
  }
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
