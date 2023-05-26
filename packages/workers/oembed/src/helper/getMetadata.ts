import { parseHTML } from 'linkedom';

import generateIframe from './meta/generateIframe';
import getDescription from './meta/getDescription';
import getEmbedUrl from './meta/getEmbedUrl';
import getImage from './meta/getImage';
import getIsLarge from './meta/getIsLarge';
import getSite from './meta/getSite';
import getTitle from './meta/getTitle';

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
  const metadata: Metadata = {
    url,
    title: getTitle(document),
    description: getDescription(document),
    image: getImage(document),
    site: getSite(document),
    isLarge: getIsLarge(document),
    html: generateIframe(getEmbedUrl(document), url)
  };

  return metadata;
};

export default getMetadata;
