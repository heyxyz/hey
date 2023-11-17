import { Errors } from '@hey/data/errors';
import type { NextApiRequest, NextApiResponse } from 'next';
import allowCors from 'utils/allowCors';
import createClickhouseClient from 'utils/createClickhouseClient';
import { array, object, string } from 'zod';

type ExtensionRequest = {
  viewer_id: string;
  ids: string[];
};

const validationSchema = object({
  viewer_id: string(),
  ids: array(string())
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req;

  if (!body) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return res.status(400).json({ success: false, error: Errors.InvalidBody });
  }

  const { viewer_id, ids } = body as ExtensionRequest;

  try {
    const values = ids.map((id) => ({
      viewer_id,
      publication_id: id
    }));

    const client = createClickhouseClient();
    const result = await client.insert({
      table: 'impressions',
      values,
      format: 'JSONEachRow'
    });

    return res.status(200).json({ success: true, id: result.query_id });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
