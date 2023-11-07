import bodyParser from 'body-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import type { Request, Response } from 'express';
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

app.get('/', (_: Request, res: Response) => {
  res.send('Impressions service');
});

wss.on('connection', (ws) => {
  ws.on('message', async (data) => {
    console.log('Client connected');
    try {
      const message = JSON.parse(data.toString());
      if (message.type === 'connection_init') {
        ws.send(JSON.stringify({ type: 'connection_ack' }));
      } else if (message.type === 'start') {
        const payload = JSON.parse(message.payload);
        await ingestImpression(payload, ws);
      } else {
        ws.send(JSON.stringify({ error: 'Unknown message received' }));
      }
    } catch (error) {
      ws.send(JSON.stringify({ error: 'Invalid data received' }));
    }
  });
});

server.listen(5001, () => {
  console.log('Listening to 5001');
});
