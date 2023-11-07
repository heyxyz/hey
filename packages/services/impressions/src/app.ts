import bodyParser from 'body-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import WebSocket from 'ws';

import ingestImpression from './lib/ingestImpression';

dotenv.config();

const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(bodyParser.json());

const wss = new WebSocket.Server({ server });

app.get('/', (req, res) => {
  res.send('Impressions service');
});

wss.on('connection', (ws) => {
  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data.toString());
      const parsedData: {
        id: string;
        type: 'connection_init' | 'start';
        payload: string;
      } = message;
      await ingestImpression(JSON.parse(parsedData.payload), ws);
    } catch (error) {
      ws.send(JSON.stringify({ error: 'Invalid data received' }));
    }
  });
});

server.listen(8888, () => {
  console.log('Listening to 8888');
});
