import formatHandle from './formatHandle';

interface Pattern {
  regex: RegExp;
}

interface PatternWithFormat extends Pattern {
  format?: (match: string) => string;
}

/**
 * Get Lens publication IDs from URLs
 * @param urls Publication URLs
 * @returns Lens publication IDs
 */
const getLensPublicationIdsFromUrls = (urls: string[]): string[] => {
  try {
    const patterns: PatternWithFormat[] = [
      { regex: /https?:\/\/localhost:4783\/posts\/([^/]+)/ },
      {
        regex:
          /https?:\/\/(?:testnet\.|staging\.|sandbox\.|staging-sandbox\.)?lenster\.xyz\/posts\/([^/]+)/
      },
      { regex: /https?:\/\/orb\.ac\/post\/([^./]+)/ }
    ];

    const publicationIds: string[] = [];

    for (const url of urls) {
      for (const pattern of patterns) {
        const match = url.match(pattern.regex);
        if (match && match[1]) {
          const publicationId = match[1];
          publicationIds.push(formatHandle(publicationId));
          break;
        }
      }
    }

    return publicationIds;
  } catch (error) {
    console.error('Failed to parse URL', error);
    return [];
  }
};

export default getLensPublicationIdsFromUrls;
