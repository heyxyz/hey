import type { ButtonType, Frame } from "@hey/types/misc";

const getFrame = (document: Document, url?: string): Frame | null => {
  const getMeta = (key: string) => {
    const selector = `meta[name="${key}"], meta[property="${key}"]`;
    const metaTag = document.querySelector(selector);
    return metaTag ? metaTag.getAttribute("content") : null;
  };

  const openFramesVersion = getMeta("of:version");
  const lensFramesVersion = getMeta("of:accepts:lens");
  const acceptsAnonymous = getMeta("of:accepts:anonymous");
  const image = getMeta("of:image") || getMeta("og:image");
  const imageAspectRatio = getMeta("of:image:aspect_ratio");
  const postUrl = getMeta("of:post_url") || url;
  const frameUrl = url || "";
  const inputText = getMeta("of:input:text") || getMeta("fc:input:text");
  const state = getMeta("of:state") || getMeta("fc:state");

  const buttons: Frame["buttons"] = [];
  for (let i = 1; i < 5; i++) {
    const button = getMeta(`of:button:${i}`) || getMeta(`fc:frame:button:${i}`);
    const action = (getMeta(`of:button:${i}:action`) ||
      getMeta(`fc:frame:button:${i}:action`) ||
      "post") as ButtonType;
    const target = (getMeta(`of:button:${i}:target`) ||
      getMeta(`fc:frame:button:${i}:target`)) as string;

    // Button post_url -> OpenFrame post_url -> frame url
    const buttonPostUrl =
      getMeta(`of:button:${i}:post_url`) ||
      getMeta(`fc:frame:button:${i}:post_url`) ||
      postUrl;

    if (!button) {
      break;
    }

    buttons.push({ action, button, postUrl: buttonPostUrl, target });
  }

  // Frames must be OpenFrame with accepted protocol of Lens (profile authentication) or anonymous (no authentication)
  if (!lensFramesVersion && !acceptsAnonymous) {
    return null;
  }

  // Frame must contain valid elements
  if (!postUrl || !image) {
    return null;
  }

  return {
    acceptsAnonymous: Boolean(acceptsAnonymous),
    acceptsLens: Boolean(lensFramesVersion),
    buttons,
    frameUrl,
    image,
    imageAspectRatio,
    inputText,
    lensFramesVersion,
    openFramesVersion,
    postUrl,
    state
  };
};

export default getFrame;
