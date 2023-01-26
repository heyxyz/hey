export default {
  async fetch(request: Request) {
    return await handleRequest(request);
  }
};

async function handleRequest(request: Request) {
  const url = new URL(request.url);
  const path = url.pathname;
  let response = await fetch(`https://ik.imagekit.io/lensterimg/media${path}`, {
    // @ts-ignore
    cf: {
      cacheEverything: true,
      cacheKey: path
    }
  });
  const shouldCache = response.headers.get('access-control-allow-origin');
  response = new Response(response.body, { ...response, status: shouldCache ? 200 : 408 });
  response.headers.delete('via');
  response.headers.delete('x-cache');
  response.headers.delete('x-amz-cf-id');
  response.headers.delete('x-request-id');
  response.headers.delete('x-server');
  response.headers.set('x-server', 'Lenster.xyz');

  return response;
}
