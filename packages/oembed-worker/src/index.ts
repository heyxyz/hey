import getMetaTags from './metadata';

export default {
  async fetch(request: Request) {
    return await handleRequest(request);
  }
};

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

const handleRequest = async (request: Request) => {
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ success: false, message: 'Only GET requests are supported' }), {
      headers
    });
  }

  const url = new URL(request.url);
  const query = url.searchParams.get('url');

  if (!query) {
    return new Response(JSON.stringify({ success: false, message: 'Missing URL parameter' }), { headers });
  }

  try {
    const { og } = await getMetaTags(query, {
      headers: { 'User-Agent': 'Twitterbot/2' }
    });

    return new Response(JSON.stringify({ success: true, og }), {
      headers
    });
  } catch {
    return new Response(JSON.stringify({ success: false, message: 'Something went wrong!' }), { headers });
  }
};
