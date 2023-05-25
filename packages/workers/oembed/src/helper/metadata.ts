import { parseHTML } from 'linkedom';

interface Metadata {
  url: string;
  title: string | null;
  description: string | null;
  image: string | null;
  site: string | null;
  isLarge: boolean | null;
}

export const getMeta = async (url: string): Promise<any> => {
  const { html } = await fetch(url, {
    cf: {
      cacheTtl: 60 * 60 * 24 * 7,
      cacheEverything: true
    },
    headers: { 'User-Agent': 'Googlebot' }
  }).then(async (res) => ({
    html: await res.text()
  }));

  const { document } = parseHTML(html);

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

  const metadata: Metadata = {
    url,
    title: null,
    description: null,
    image: null,
    site: null,
    isLarge: null
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

  return metadata;
};
