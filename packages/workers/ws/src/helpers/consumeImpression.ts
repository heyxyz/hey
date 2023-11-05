import type { Env } from '../types';

const consumeImpression = async (payload: any, websocket: any, env: Env) => {
  if (payload.viewer_id && payload.publication_id) {
    const { viewer_id, publication_id } = payload;
    await env.IMPRESSIONS_QUEUE.send({ viewer_id, publication_id });
    websocket.send(JSON.stringify({ id: crypto.randomUUID() }));
  }
};

export default consumeImpression;
