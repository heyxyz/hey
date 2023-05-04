const handleRequest = async (request: Request) => {
  try {
    const ip = request.headers.get('cf-connecting-ip');
    const country = request.headers.get('cf-ipcountry');
    const ray = request.headers.get('cf-ray');

    return new Response(JSON.stringify({ success: true, ip, country, ray }));
  } catch {
    return new Response(JSON.stringify({ success: false }));
  }
};

export default {
  async fetch(request: Request) {
    return await handleRequest(request);
  }
};
