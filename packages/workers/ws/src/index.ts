import type { Env } from './types';

const handleSession = async (websocket: any, env: Env) => {
  websocket.accept();
  websocket.addEventListener('message', async ({ data }: { data: string }) => {
    const message: {
      viewer_id: string;
      publication_id: string;
    } = JSON.parse(data);

    if (message.viewer_id && message.publication_id) {
      const clickhouseResponse = await fetch(env.CLICKHOUSE_REST_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: `
          INSERT INTO impressions (
            viewer_id,
            publication_id
          ) VALUES (
            '${message.viewer_id}',
            '${message.publication_id}'
          )
        `
      });
      if (clickhouseResponse.status !== 200) {
        websocket.send(JSON.stringify({ error: 'Insert error' }));
      } else {
        websocket.send(
          JSON.stringify({
            id: clickhouseResponse.headers.get('x-clickhouse-query-id')
          })
        );
      }
    } else {
      websocket.send(JSON.stringify({ error: 'Unknown message received' }));
    }
  });

  websocket.addEventListener('close', async (evt: any) => {
    console.log(evt);
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
