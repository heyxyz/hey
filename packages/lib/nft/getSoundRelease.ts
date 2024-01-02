import type { SoundReleaseMetadata } from '@hey/types/nft';

const regex = /https:\/\/www\.sound\.xyz\/(\w+)\/([\w-]+)/;

/**
 * Get Sound release slug and handle from a URL
 * @param url URL
 * @returns Sound release slug and handle metadata
 */
const getSoundRelease = (url: string): null | SoundReleaseMetadata => {
  const matches = regex.exec(url);
  if (matches && matches.length >= 3) {
    const handle = matches[1];
    const slug = matches[2];
    const mintLink = `https://www.sound.xyz/${handle}/${slug}`;

    return { handle, mintLink, provider: 'sound-release', slug };
  }

  return null;
};

export default getSoundRelease;
