import createClickhouseClient from '../createClickhouseClient';

export const getFingerprintByActor = async (
  actor: string
): Promise<null | string> => {
  const client = createClickhouseClient();
  const rows = await client.query({
    format: 'JSONEachRow',
    query: `
      SELECT fingerprint FROM events
      WHERE actor = '${actor}'
      ORDER BY created DESC
      LIMIT 1;
    `
  });

  const result = await rows.json<{ fingerprint: string }>();

  return result[0]?.fingerprint || null;
};

export const getFingerprintByWallet = async (
  wallet?: string
): Promise<null | string> => {
  if (!wallet) {
    return null;
  }

  const client = createClickhouseClient();
  const rows = await client.query({
    format: 'JSONEachRow',
    query: `
      SELECT fingerprint FROM events
      WHERE wallet = '${wallet}'
      ORDER BY created DESC
      LIMIT 1;
    `
  });

  const result = await rows.json<{ fingerprint: string }>();

  return result[0]?.fingerprint || null;
};
