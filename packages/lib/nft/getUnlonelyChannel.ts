import type { UnlonelyChannelMetadata } from '@hey/types/nft';

const regex = /https:\/\/www\.unlonely\.app\/channels\/(\w+)/;

/**
 * Get Unlonely channel slug from a URL
 * @param url URL
 * @returns Unlonely channel slug metadata
 */
const getUnlonelyChannel = (url: string): null | UnlonelyChannelMetadata => {
  const matches = regex.exec(url);
  if (matches?.[1]) {
    const slug = matches[1];
    const mintLink = `https://www.unlonely.app/channels/${slug}`;

    return { mintLink, provider: 'unlonely-channel', slug };
  }

  return null;
};

export default getUnlonelyChannel;
