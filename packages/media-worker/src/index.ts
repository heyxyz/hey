export default {
  async fetch(request: Request) {
    return await handleRequest(request);
  }
};

async function handleRequest(request: Request) {
  let url = new URL(request.url);
  let options: any = {
    cf: {
      cacheEverything: true,
      cacheKey: url.pathname,
      image: { quality: 90, format: 'auto' }
    }
  };

  if (url.searchParams.has('name')) {
    if (url.searchParams.get('name') === 'avatar') {
      options.cf.image.width = 300;
      options.cf.image.height = 300;
    } else if (url.searchParams.get('name') === 'cover') {
      options.cf.image.height = 1000;
    } else if (url.searchParams.get('name') === 'attachment') {
      options.cf.image.height = 1000;
    }
  }

  const accept = request.headers.get('Accept') as string;
  if (/image\/avif/.test(accept)) {
    options.cf.image.format = 'avif';
  } else if (/image\/webp/.test(accept)) {
    options.cf.image.format = 'webp';
  }

  const imageURL = url.searchParams.get('image');
  if (!imageURL) {
    return new Response('Missing "image" value', { status: 400 });
  }

  const imageRequest = new Request(imageURL, {
    headers: request.headers
  });

  return fetch(imageRequest, options);
}
