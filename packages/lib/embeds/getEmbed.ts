import type { EmbedMetadata } from '@hey/types/embed';

import getSnapshot from './getSnapshot';

export const knownEmbedHostnames = new Set(['snapshot.org']);

const getEmbed = (urls: string[]): EmbedMetadata | null => {
  if (!urls.length) {
    return null;
  }

  const knownUrls = urls.filter((url) => {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.replace('www.', '');
    return knownEmbedHostnames.has(hostname);
  });

  if (!knownUrls.length) {
    return null;
  }

  const url = knownUrls[0];
  const hostname = new URL(url).hostname.replace('www.', '');

  switch (true) {
    case hostname === 'snapshot.org':
      return getSnapshot(url);
    default:
      return null;
  }
};

export default getEmbed;
