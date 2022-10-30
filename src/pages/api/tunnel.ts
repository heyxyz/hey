import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import * as url from 'url';

export const config = {
  runtime: 'experimental-edge'
};

const handler = async (req: NextRequest) => {
  try {
    const envelope: any = req.body;
    const pieces = envelope.split('\n');
    const header = JSON.parse(pieces[0]);
    const { host, path } = url.parse(header.dsn);
    const projectId = path?.endsWith('/') ? path.slice(0, -1) : path;
    const ingestUrl = `https://${host}/api${projectId}/envelope/`;
    await fetch(ingestUrl, { method: 'POST', body: envelope });

    return NextResponse.json({ status: 'ok' });
  } catch {
    return NextResponse.json({ status: 'invalid request' });
  }
};

export default handler;
