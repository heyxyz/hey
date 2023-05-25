import type { IRequest } from 'itty-router';

import type { Env } from '../types';

export default async (request: IRequest, env: Env) => {
  try {
    const url = request.query.url as string;

    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing URL' })
      );
    }

    const decodedUrl = decodeURIComponent(url);
    const encodedSeed = new TextEncoder().encode(url);
    const digest = await crypto.subtle.digest({ name: 'SHA-256' }, encodedSeed);
    const key = [...new Uint8Array(digest)]
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    console.log(env);
    const object = await env.LENSTER_IFRAMELY.get(key, {
      cacheTtl: 60 * 60 * 24 * 30
    });

    if (object) {
      const responseBody = new Response(object);

      return new Response(
        JSON.stringify({
          success: true,
          snapshotted: true,
          key,
          iframely: await responseBody.json()
        })
      );
    }

    const response = await fetch(
      `https://iframely-node.lenster.xyz/iframely?url=${decodedUrl}`,
      {
        cf: {
          cacheTtl: 60 * 60 * 24 * 30,
          cacheEverything: true
        }
      }
    );
    const data = await response.json();

    await env.LENSTER_IFRAMELY.put(key, JSON.stringify(data));

    return new Response(
      JSON.stringify({ success: true, snapshotted: false, key, iframely: data })
    );
  } catch (error) {
    console.error('Failed to get iframely data', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Something went wrong!' })
    );
  }
};
