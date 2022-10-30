import type { NextApiRequest, NextApiResponse } from 'next';
import * as url from 'url';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const envelope = req.body;
    const pieces = envelope.split('\n');
    const header = JSON.parse(pieces[0]);
    const { host, path } = url.parse(header.dsn);
    const projectId = path?.endsWith('/') ? path.slice(0, -1) : path;
    const ingestUrl = `https://${host}/api${projectId}/envelope/`;
    await fetch(ingestUrl, { method: 'POST', body: envelope });

    return res.status(200).json({ status: 'ok' });
  } catch {
    return res.status(400).json({ status: 'invalid request' });
  }
};

export default handler;
