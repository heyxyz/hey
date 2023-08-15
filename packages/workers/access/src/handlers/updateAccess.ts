import { Errors } from '@lenster/data/errors';
import { Regex } from '@lenster/data/regex';
import type { IRequest } from 'itty-router';
import { boolean, object, string } from 'zod';

import type { Env } from '../types';

type ExtensionRequest = {
  id: string;
  isStaff: boolean;
  isGardener: boolean;
  isTrustedMember: boolean;
  accessToken: string;
};

const validationSchema = object({
  id: string(),
  isStaff: boolean(),
  isGardener: boolean(),
  isTrustedMember: boolean(),
  accessToken: string().regex(Regex.accessToken),
  isMainnet: boolean()
});

export default async (request: IRequest, env: Env) => {
  const body = await request.json();
  if (!body) {
    return new Response(
      JSON.stringify({ success: false, error: Errors.NoBody })
    );
  }

  if (!id) {
    return new Response(
      JSON.stringify({ success: false, error: Errors.NoBody })
    );
  }

  try {
    const clickhouseResponse = await fetch(
      `${env.CLICKHOUSE_REST_ENDPOINT}&default_format=JSONCompact`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cf: { cacheTtl: 600, cacheEverything: true },
        body: `SELECT * FROM rights WHERE id = '${id}';`
      }
    );

    if (clickhouseResponse.status !== 200) {
      return new Response(
        JSON.stringify({ success: false, error: Errors.StatusCodeIsNot200 })
      );
    }

    const json: {
      data: [string, boolean, boolean, boolean][];
    } = await clickhouseResponse.json();

    if (json.data.length) {
      const updateResponse = await fetch(
        `${env.CLICKHOUSE_REST_ENDPOINT}&default_format=JSONCompact`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          cf: { cacheTtl: 600, cacheEverything: true },
          body: `ALTER TABLE rights UPDATE is_read = ${!json
            .data[0][1]}, is_write = ${!json.data[0][2]}, is_delete = ${!json
            .data[0][3]} WHERE id = '${id}';`
        }
      );

      if (updateResponse.status !== 200) {
        return new Response(
          JSON.stringify({ success: false, error: Errors.StatusCodeIsNot200 })
        );
      }

      return new Response(JSON.stringify({ success: true }));
    } else {
      const insertResponse = await fetch(
        `${env.CLICKHOUSE_REST_ENDPOINT}&default_format=JSONCompact`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          cf: { cacheTtl: 600, cacheEverything: true },
          body: dataToUpdateOrInsert.insertSQL
        }
      );

      if (insertResponse.status !== 200) {
        return new Response(
          JSON.stringify({ success: false, error: Errors.StatusCodeIsNot200 })
        );
      }

      return new Response(JSON.stringify({ success: true }));
    }
  } catch (error) {
    throw error;
  }
};
