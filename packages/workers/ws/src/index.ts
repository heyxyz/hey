import ingestImpression from './helpers/ingestImpression';
import type { Env } from './types';

const handleSession = async (websocket: any, env: Env) => {
  websocket.accept();
  websocket.addEventListener('message', async ({ data }: { data: string }) => {
    const message: {
      id: string;
      type: 'connection_init' | 'start';
      payload: string;
    } = JSON.parse(data);

    if (message.type === 'connection_init') {
      websocket.send(JSON.stringify({ type: 'connection_ack' }));
    } else if (message.type === 'start') {
      const payload = JSON.parse(message.payload);
      ingestImpression(payload, websocket, env);
    } else {
      websocket.send(JSON.stringify({ error: 'Unknown message received' }));
    }
  });
};

const handleRequest = async (request: Request, env: Env) => {
  const upgradeHeader = request.headers.get('Upgrade');
  if (upgradeHeader !== 'websocket') {
    return new Response('Expected websocket', { status: 400 });
  }

  const [client, server] = Object.values(new WebSocketPair());
  await handleSession(server, env);

  return new Response(null, {
    status: 101,
    webSocket: client
  });
};

export default {
  async fetch(request: Request, env: Env) {
    return await handleRequest(request, env);
  }
};
