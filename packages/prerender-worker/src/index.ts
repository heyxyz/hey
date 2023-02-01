export default {
  async fetch(request: Request) {
    return await handleRequest(request);
  }
};

async function handleRequest(request: Request) {
  const userAgent = request.headers.get('User-Agent') || '';
  const re = /bot|telegram|baidu|bing|yandex|iframely|whatsapp|facebook/i;

  if (re.test(userAgent)) {
    const url = new URL(request.url);
    const path = url.pathname;
    const res = await fetch(`https://api.lenster.xyz/prerender/${path}`);

    return res;
  }

  return fetch(request);
}
