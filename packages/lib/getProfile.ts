import type { Profile } from '@hey/lens';

import sanitizeDisplayName from './sanitizeDisplayName';

const getProfile = (
  profile: Profile | null
): {
  prefix: '@' | '#';
  slug: string;
  slugWithPrefix: string;
  displayName: string;
  link: string;
} => {
  if (!profile) {
    return {
      prefix: '@',
      slug: '...',
      slugWithPrefix: '...',
      displayName: '...',
      link: ''
    };
  }

  const prefix = profile.handle ? '@' : '#';
  const slug = profile.handle?.localName || profile.id;

  return {
    prefix,
    slug,
    slugWithPrefix: `${prefix}${slug}`,
    displayName: sanitizeDisplayName(profile.metadata?.displayName) || slug,
    link: profile.handle
      ? `/u/${profile.handle.localName}`
      : `/profile/${profile.id}`
  };
};

export default getProfile;
