import type { OG } from '@hey/types/misc';
import { parseHTML } from 'linkedom';

import type { Env } from '../types';
import getProxyUrl from './getProxyUrl';
import generateIframe from './meta/generateIframe';
import getDescription from './meta/getDescription';
import getEmbedUrl from './meta/getEmbedUrl';
import getImage from './meta/getImage';
import getIsLarge from './meta/getIsLarge';
import getSite from './meta/getSite';
import getTitle from './meta/getTitle';

const getMetadata = async (url: string, env: Env): Promise<any> => {
  const { html } = await fetch(url, {
    cf: {
      cacheTtl: 60 * 60 * 24 * 7,
      cacheEverything: true
    },
    headers: { 'User-Agent': 'Twitterbot' }
  }).then(async (res) => ({
    html: await res.text()
  }));

  const { document } = parseHTML(html);
  const isLarge = getIsLarge(document) as boolean;
  const image = getImage(document) as string;
  const proxiedUrl = getProxyUrl(image, isLarge, env);
  const metadata: OG = {
    url,
    title: getTitle(document),
    description: getDescription(document),
    image: proxiedUrl,
    site: getSite(document),
    favicon: `https://www.google.com/s2/favicons?domain=${url}`,
    isLarge,
    html: generateIframe(getEmbedUrl(document), url)
  };

  return metadata;
};

export default getMetadata;
