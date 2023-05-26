import { parseHTML } from 'linkedom';

import generateIframe from './iframe';

const knownSites = [
  'youtube.com',
  'youtu.be',
  'lenstube.xyz',
  'open.spotify.com'
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

  // Title
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const twitterTitle = document.querySelector('meta[name="twitter:title"]');

  // Description
  const ogDescription = document.querySelector(
    'meta[property="og:description"]'
  );
  const twitterDescription = document.querySelector(
    'meta[name="twitter:description"]'
  );

  // Image
  const ogImage = document.querySelector('meta[property="og:image"]');
  const twitterImage =
    document.querySelector('meta[name="twitter:image"]') ||
    document.querySelector('meta[name="twitter:image:src"]');

  // Site
  const ogSite = document.querySelector('meta[property="og:site_name"]');
  const twitterSite = document.querySelector('meta[name="twitter:site"]');

  // Card
  const twitterCard = document.querySelector('meta[name="twitter:card"]');

  // Embed URL
  const ogEmbed =
    document.querySelector('meta[property="og:video:url"]') ||
    document.querySelector('meta[property="og:video:secure_url"]');
  const twitterEmbed = document.querySelector('meta[name="twitter:player"]');

  const metadata: Metadata = {
    url,
    title: null,
    description: null,
    image: null,
    site: null,
    isLarge: null,
    html: null
  };

  if (ogTitle) {
    metadata.title = ogTitle.getAttribute('content');
  } else if (twitterTitle) {
    metadata.title = twitterTitle.getAttribute('content');
  }

  if (ogDescription) {
    metadata.description = ogDescription.getAttribute('content');
  } else if (twitterDescription) {
    metadata.description = twitterDescription.getAttribute('content');
  }

  if (ogImage) {
    metadata.image = ogImage.getAttribute('content');
  } else if (twitterImage) {
    metadata.image = twitterImage.getAttribute('content');
  }

  if (ogSite) {
    metadata.site = ogSite.getAttribute('content');
  } else if (twitterSite) {
    metadata.site = twitterSite.getAttribute('content');
  }

  if (twitterCard) {
    const largeTypes = ['summary_large_image', 'player'];
    const card = twitterCard.getAttribute('content') || '';

    metadata.isLarge = largeTypes.includes(card);
  }

  const hostname = parsedUrl.hostname.replace('www.', '');
  if (knownSites.includes(hostname)) {
    let embedUrl;
    if (ogEmbed) {
      embedUrl = ogEmbed.getAttribute('content');
    } else if (twitterEmbed) {
      embedUrl = twitterEmbed.getAttribute('content');
    }

    if (embedUrl || url) {
      metadata.html = generateIframe(embedUrl || url, hostname);
    }
  }

  return metadata;
};

export default getMetadata;
