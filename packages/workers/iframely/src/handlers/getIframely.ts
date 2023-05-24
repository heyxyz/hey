import type { Env } from '../types';

export default async (url: string, env: Env) => {
  try {
    const decodedUrl = decodeURIComponent(url);

    const response = await fetch(
      `https://iframely.lenster.xyz/iframely?url=${decodedUrl}`
    );

    const encodedSeed = new TextEncoder().encode(url);
    const digest = await crypto.subtle.digest({ name: 'SHA-256' }, encodedSeed);
    const key = [...new Uint8Array(digest)]
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    const data = await response.json();

    const object = await env.LENSTER_IFRAMELY.get(key);

    if (object) {
      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set('etag', object.httpEtag);
      const responseBody = new Response(object.body, { headers });

      return new Response(
        JSON.stringify({
          success: true,
          cached: true,
          key,
          data: await responseBody.json()
        })
      );
    }

    await env.LENSTER_IFRAMELY.put(key, JSON.stringify(data));

    return new Response(
      JSON.stringify({ success: true, cached: false, key, data })
    );
  } catch (error) {
    console.error('Failed to get iframely data', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Something went wrong!' })
    );
  }
};
