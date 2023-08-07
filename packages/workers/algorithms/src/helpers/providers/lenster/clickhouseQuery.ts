import type { Env } from '../../../types';

const clickhouseQuery = async (query: string, env: Env) => {
  try {
    const response = await fetch(
      `${env.CLICKHOUSE_REST_ENDPOINT}&default_format=JSONCompact`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cf: { cacheTtl: 600, cacheEverything: true },
        body: query
      }
    );

    if (response.status !== 200) {
      return [];
    }

    const json: { data: [any][] } = await response.json();

    return json.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default clickhouseQuery;
