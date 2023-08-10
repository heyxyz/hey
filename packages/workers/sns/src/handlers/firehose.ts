import { Errors } from '@lenster/data/errors';
import { type IRequest } from 'itty-router';

export default async (request: IRequest) => {
  const body = await request.json();
  if (!body) {
    return new Response(
      JSON.stringify({ success: false, error: Errors.NoBody })
    );
  }

  try {
    console.log('sending to firehose', JSON.stringify(body));

    return new Response(JSON.stringify({ success: true }));
  } catch (error) {
    throw error;
  }
};
