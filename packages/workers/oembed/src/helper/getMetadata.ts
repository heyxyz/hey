import { parseHTML } from 'linkedom';

import generateIframe from './meta/generateIframe';
import getDescription from './meta/getDescription';
import getEmbedUrl from './meta/getEmbedUrl';
import getImage from './meta/getImage';
import getIsLarge from './meta/getIsLarge';
import getSite from './meta/getSite';
import getTitle from './meta/getTitle';

const knownSites = [
  'youtube.com',
  'youtu.be',
  'lenstube.xyz',
  'open.spotify.com',
  'soundcloud.com',
  'oohlala.xyz'
];

interface Metadata {
  url: string;
  title: string | null;
  description: string | null;
  image: string | null;
  site: string | null;
  isLarge: boolean | null;
  html: string | null;
}

const getMetadata = async (url: string): Promise<any> => {
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
  const parsedUrl = new URL(url);
  const hostname = parsedUrl.hostname.replace('www.', '');

  const metadata: Metadata = {
    url,
    title: null,
    description: null,
    image: null,
    site: null,
    isLarge: null,
    html: null
  };

  metadata.title = getTitle(document);
  metadata.description = getDescription(document);
  metadata.image = getImage(document);
  metadata.site = getSite(document);
  metadata.isLarge = getIsLarge(document);

  if (knownSites.includes(hostname)) {
    const embedUrl = getEmbedUrl(document);

    if (embedUrl || url) {
      metadata.html = generateIframe(embedUrl || url, hostname);
    }
  }

  return metadata;
};

export default getMetadata;
