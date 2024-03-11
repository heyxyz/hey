import type { ButtonType, Portal } from '@hey/types/misc';
import type { Document } from 'linkedom';

const getPortal = (document: Document, url?: string): null | Portal => {
  const getMeta = (key: string) => {
    const selector = `meta[name="${key}"], meta[property="${key}"]`;
    const metaTag = document.querySelector(selector);
    return metaTag ? metaTag.getAttribute('content') : null;
  };

  const version = getMeta('hey:portal') || getMeta('fc:frame');
  const image =
    getMeta('hey:portal:image') ||
    getMeta('fc:frame:image') ||
    getMeta('og:image');
  const postUrl =
    getMeta('hey:portal:post_url') || getMeta('fc:frame:post_url') || url;
  const portalUrl = url || '';

  let buttons: Portal['buttons'] = [];
  for (let i = 1; i < 5; i++) {
    const button =
      getMeta(`hey:portal:button:${i}`) || getMeta(`fc:frame:button:${i}`);
    const action = (getMeta(`hey:portal:button:${i}:action`) ||
      getMeta(`fc:frame:button:${i}:action`) ||
      'post') as ButtonType;
    const target = (getMeta(`hey:portal:button:${i}:target`) ||
      getMeta(`fc:frame:button:${i}:target`)) as string;

    if (!button) {
      break;
    }

    buttons.push({ action, button, target });
  }

  if (!version || !postUrl || !image || buttons.length === 0) {
    return null;
  }

  return { buttons, image, portalUrl, postUrl, version };
};

export default getPortal;
