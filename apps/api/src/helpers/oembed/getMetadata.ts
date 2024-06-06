import type { OG } from '@good/types/misc';

import getFavicon from '@good/helpers/getFavicon';
import axios from 'axios';
import { parseHTML } from 'linkedom';

import { GOOD_USER_AGENT } from '../constants';
import getProxyUrl from './getProxyUrl';
import generateIframe from './meta/generateIframe';
import getDescription from './meta/getDescription';
import getEmbedUrl from './meta/getEmbedUrl';
import getFrame from './meta/getFrame';
import getImage from './meta/getImage';
import getNft from './meta/getNft';
import getSite from './meta/getSite';
import getTitle from './meta/getTitle';

const getMetadata = async (url: string): Promise<OG> => {
  const { data } = await axios.get(url, {
    headers: { 'User-Agent': GOOD_USER_AGENT }
  });

  const { document } = parseHTML(data);
  const image = getImage(document) as string;

  const metadata: OG = {
    description: getDescription(document),
    favicon: getFavicon(url),
    frame: getFrame(document, url),
    html: generateIframe(getEmbedUrl(document), url),
    image: getProxyUrl(image),
    lastIndexedAt: new Date().toISOString(),
    nft: getNft(document, url),
    site: getSite(document),
    title: getTitle(document),
    url
  };

  return metadata;
};

export default getMetadata;
