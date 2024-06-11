import createClickhouseClient from '../createClickhouseClient';

export const getIpByActor = async (actor: string): Promise<null | string> => {
  const client = createClickhouseClient();
  const rows = await client.query({
    format: 'JSONEachRow',
    query: `
      SELECT ip FROM events
      WHERE actor = '${actor}'
      ORDER BY created DESC
      LIMIT 1;
    `
  });

  const result = await rows.json<{ ip: string }>();

  return result[0]?.ip || null;
};

export const getIpByWallet = async (
  wallet?: string
): Promise<null | string> => {
  if (!wallet) {
    return null;
  }

  const client = createClickhouseClient();
  const rows = await client.query({
    format: 'JSONEachRow',
    query: `
      SELECT ip FROM events
      WHERE wallet = '${wallet}'
      ORDER BY created DESC
      LIMIT 1;
    `
  });

  const result = await rows.json<{ ip: string }>();

  return result[0]?.ip || null;
};
