import type { ButtonType, Frame } from '@hey/types/misc';

const getFrame = (document: Document, url?: string): Frame | null => {
  const getMeta = (key: string) => {
    const selector = `meta[name="${key}"], meta[property="${key}"]`;
    const metaTag = document.querySelector(selector);
    return metaTag ? metaTag.getAttribute('content') : null;
  };

  const ofVersion = getMeta('of:version');
  const lensVersion = getMeta('of:accepts:lens');
  const acceptsAnonymous = getMeta('of:accepts:anonymous');
  const image = getMeta('of:image') || getMeta('og:image');
  const postUrl = getMeta('of:post_url') || url;
  const frameUrl = url || '';

  let buttons: Frame['buttons'] = [];
  for (let i = 1; i < 5; i++) {
    const button = getMeta(`of:button:${i}`) || getMeta(`fc:frame:button:${i}`);
    const action = (getMeta(`of:button:${i}:action`) ||
      getMeta(`fc:frame:button:${i}:action`)) as ButtonType;
    const target = (getMeta(`of:button:${i}:target`) ||
      getMeta(`fc:frame:button:${i}:target`)) as string;
    const postUrl =
      getMeta(`of:button:${i}:post_url`) ||
      getMeta(`fc:frame:button:${i}:post_url`) ||
      url;

    if (!button) {
      break;
    }

    buttons.push({ action, button, postUrl, target });
  }

  // Frames must be OpenFrame with accepted protocol of Lens (profile authentication) or anonymous (no authentication)
  if (!lensVersion && !acceptsAnonymous) {
    return null;
  }

  // Frame must contain valid elements
  if (!postUrl || !image || buttons.length === 0) {
    return null;
  }

  return {
    authenticated: !acceptsAnonymous,
    buttons,
    frameUrl,
    image,
    lensVersion,
    ofVersion,
    postUrl
  };
};

export default getFrame;
