import type { UnlonelyNfcMetadata } from '@hey/types/nft';

const regex = /https:\/\/www\.unlonely\.app\/nfc\/(\w+)/;

/**
 * Get Unlonely nfc id from a URL
 * @param url URL
 * @returns Unlonely nfc id metadata
 */
const getUnlonelyNfc = (url: string): null | UnlonelyNfcMetadata => {
  const matches = regex.exec(url);
  if (matches?.[1]) {
    const id = matches[1];
    const mintLink = `https://www.unlonely.app/nfc/${id}`;

    return { id, mintLink, provider: 'unlonely-nfc' };
  }

  return null;
};

export default getUnlonelyNfc;
