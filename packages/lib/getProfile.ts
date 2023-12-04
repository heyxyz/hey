import type { Profile } from '@hey/lens';

import sanitizeDisplayName from './sanitizeDisplayName';

const getProfile = (
  profile: null | Profile
): {
  displayName: string;
  link: string;
  slug: string;
  slugWithPrefix: string;
  staffLink: string;
} => {
  if (!profile) {
    return {
      displayName: '...',
      link: '',
      slug: '...',
      slugWithPrefix: '...',
      staffLink: ''
    };
  }

  const prefix = profile.handle ? '@' : '#';
  const slug = profile.handle?.localName || profile.id;

  return {
    displayName: sanitizeDisplayName(profile.metadata?.displayName) || slug,
    link: profile.handle
      ? `/u/${profile.handle.localName}`
      : `/profile/${profile.id}`,
    slug,
    slugWithPrefix: `${prefix}${slug}`,
    staffLink: `/staff/users/${profile.id}`
  };
};

export default getProfile;
