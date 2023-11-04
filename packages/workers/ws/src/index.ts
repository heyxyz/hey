import type { Env } from './types';

const handleSession = async (websocket: any, env: Env) => {
  websocket.accept();
  websocket.addEventListener('message', async ({ data }: { data: string }) => {
    const message: {
      id: string;
      type: 'connection_init' | 'start' | 'ka';
      payload: string;
    } = JSON.parse(data);

    if (message.type === 'connection_init') {
      websocket.send(JSON.stringify({ type: 'connection_ack' }));
    } else if (message.type === 'ka') {
      websocket.send(JSON.stringify({ type: 'ka' }));
    } else if (message.type === 'start') {
      const payload = JSON.parse(message.payload);

      if (payload.viewer_id && payload.publication_id) {
        const { viewer_id, publication_id } = payload;
        const insertedRecently = await fetch(
          `${env.CLICKHOUSE_REST_ENDPOINT}&default_format=JSONCompact`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: `
              SELECT 
                count(*)
              FROM impressions
              WHERE viewer_id = '${viewer_id}' AND
              publication_id = '${publication_id}' AND
              viewed_at > now64(3) - INTERVAL 20 SECOND;
            `
          }
        );
        const json: {
          data: [string][];
        } = await insertedRecently.json();

        if (parseInt(json.data[0][0]) < 1) {
          const clickhouseResponse = await fetch(env.CLICKHOUSE_REST_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: `
            INSERT INTO impressions (
              viewer_id,
              publication_id
            ) VALUES (
              '${viewer_id}',
              '${publication_id}'
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
          websocket.send(
            JSON.stringify({ message: 'Already seen less than 10 seconds!' })
          );
        }
      }
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
