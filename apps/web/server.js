import fs from 'node:fs/promises';

import compression from 'compression';
import express from 'express';
import sirv from 'sirv';

const port = process.env.PORT || 4783;
const base = process.env.BASE || '/';

const app = express();

app.use(compression());
app.use(base, sirv('./dist/client', { extensions: [] }));

// Serve HTML
app.use('*', async (req, res) => {
  try {
    const html = await fs.readFile('./dist/client/index.html', 'utf-8');
    res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
  } catch (e) {
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
