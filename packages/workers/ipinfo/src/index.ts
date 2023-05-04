const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

const handleRequest = async (request: Request) => {
  try {
    const ip = request.headers.get('cf-connecting-ip');
    const country = request.headers.get('cf-ipcountry');
    const ray = request.headers.get('cf-ray');

    return new Response(JSON.stringify({ success: true, ip, country, ray }), {
      headers
    });
  } catch {
    return new Response(JSON.stringify({ success: false }), { headers });
  }
};

export default {
  async fetch(request: Request) {
    return await handleRequest(request);
  }
};
