type EnvType = {
  DATADOG_TOKEN: string;
};

export default {
  async fetch(request: Request, env: EnvType) {
    return await handleRequest(request, env);
  }
};

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

const handleRequest = async (request: Request, env: EnvType) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, message: 'Only POST requests are supported' }), {
      headers
    });
  }

  const allowedOrigins = ['https://lenster.xyz', 'https://www.lenster.xyz'];

  if (!allowedOrigins.includes(request.headers.get('origin') || '')) {
    return new Response(JSON.stringify({ success: false, message: 'Origin not allowed' }), { headers });
  }

  const payload = await request.json();

  if (!payload) {
    return new Response(JSON.stringify({ success: false, message: 'No body provided' }), { headers });
  }

  try {
    const appenedPayload = {
      ...payload,
      ip: request.headers.get('cf-connecting-ip') || 'unknown'
    };
    const datadogRes = await fetch(
      `https://http-intake.logs.datadoghq.com/api/v2/logs?dd-api-key=${
        env.DATADOG_TOKEN
      }&dd-request-id=${crypto.randomUUID()}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(appenedPayload)
      }
    );

    return new Response(
      JSON.stringify({
        success: true,
        payload: appenedPayload,
        ddResponse: await datadogRes.json()
      }),
      { headers }
    );
  } catch {
    return new Response(JSON.stringify({ success: false, message: 'Something went wrong!' }), { headers });
  }
};
