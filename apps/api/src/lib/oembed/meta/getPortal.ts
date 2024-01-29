import type { ButtonType, Portal } from '@hey/types/misc';
import type { Document } from 'linkedom';

const getPortal = (document: Document): null | Portal => {
  const version = document.querySelector('meta[property="hey:portal"]');
  const image =
    document.querySelector('meta[property="hey:portal:image"]') ||
    document.querySelector('meta[property="og:image"]');
  const postUrl = document.querySelector(
    'meta[property="hey:portal:post_url"]'
  );

  let buttons: Portal['buttons'] = [];
  for (let i = 1; i < 5; i++) {
    const button = document.querySelector(
      `meta[property="hey:portal:button:${i}"]`
    );
    const type = document.querySelector(
      `meta[property="hey:portal:button:${i}:type"]`
    );

    if (!button || !type) {
      break;
    }

    buttons.push({
      button: button?.getAttribute('content') as string,
      type: type?.getAttribute('content') as ButtonType
    });
  }

  if (!version || !postUrl || !image || buttons.length === 0) {
    return null;
  }

  return {
    buttons,
    image: image?.getAttribute('content') as string,
    postUrl: postUrl?.getAttribute('content') as string,
    version: version?.getAttribute('content') as string
  };
};

export default getPortal;
