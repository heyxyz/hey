import type { ButtonType, Portal } from '@hey/types/misc';
import type { Document } from 'linkedom';

const getPortal = (document: Document): null | Portal => {
  const getMeta = (key: string) => {
    const selector = `meta[name="${key}"], meta[property="${key}"]`;
    const metaTag = document.querySelector(selector);
    return metaTag ? metaTag.getAttribute('content') : null;
  };

  const version = getMeta('hey:portal') || getMeta('fc:frame');
  const image =
    getMeta('hey:portal:image') ||
    getMeta('og:image') ||
    getMeta('fc:frame:image');
  const postUrl =
    getMeta('hey:portal:post_url') || getMeta('fc:frame:post_url');

  let buttons: Portal['buttons'] = [];
  for (let i = 1; i < 5; i++) {
    const button =
      getMeta(`hey:portal:button:${i}`) || getMeta(`fc:frame:button:${i}`);
    const type = (getMeta(`hey:portal:button:${i}:type`) ||
      'submit') as ButtonType;

    if (!button) {
      break;
    }

    buttons.push({ button, type });
  }

  if (!version || !postUrl || !image || buttons.length === 0) {
    return null;
  }

  return { buttons, image, postUrl, version };
};

export default getPortal;
