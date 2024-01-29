import type { ButtonType, Portal } from '@hey/types/misc';
import type { Document } from 'linkedom';

const getPortal = (document: Document): null | Portal => {
  const version = document.querySelector('meta[property="hey:portal"]');
  const image =
    document.querySelector('meta[property="hey:portal:image"]') ||
    document.querySelector('meta[property="og:image"]');

  let buttons: Portal['buttons'] = [];
  for (let i = 1; i < 5; i++) {
    const action = document.querySelector(
      `meta[property="hey:portal:button:${i}:action"]`
    );
    const button = document.querySelector(
      `meta[property="hey:portal:button:${i}"]`
    );
    const type = document.querySelector(
      `meta[property="hey:portal:button:${i}:type"]`
    );

    if (!action || !button || !type) {
      break;
    }

    buttons.push({
      action: action?.getAttribute('content') as string,
      button: button?.getAttribute('content') as string,
      type: type?.getAttribute('content') as ButtonType
    });
  }

  if (!version || !image || buttons.length === 0) {
    return null;
  }

  return {
    buttons,
    image: image?.getAttribute('content') as string,
    version: version?.getAttribute('content') as string
  };
};

export default getPortal;
