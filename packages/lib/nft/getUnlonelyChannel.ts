import type { UnlonelyChannelMetadata } from '@hey/types/nft';

const regex = /https:\/\/www\.unlonely\.app\/channels\/(\w+)/;

/**
 * Get Unlonely channel slug from a URL
 * @param url URL
 * @returns Unlonely channel slug metadata
 */
const getUnlonelyChannel = (url: string): UnlonelyChannelMetadata | null => {
  const matches = regex.exec(url);
  if (matches && matches[1]) {
    const slug = matches[1];
    return { slug, provider: 'unlonely-channel' };
  }

  return null;
};

export default getUnlonelyChannel;
