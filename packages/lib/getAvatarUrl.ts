import { ZERO_ADDRESS } from '@lenster/data/constants';
import type { Profile } from '@lenster/lens';

import getStampFyiURL from './getStampFyiURL';

const getAvatarUrl = (profile: Profile): string => {
  const stampFyiUrl = getStampFyiURL(profile?.ownedBy.address ?? ZERO_ADDRESS);

  if (profile?.metadata?.picture?.__typename === 'ImageSet') {
    return (
      profile?.metadata?.picture?.raw?.uri ??
      profile?.metadata?.picture?.optimized?.uri ??
      stampFyiUrl
    );
  } else if (profile?.metadata?.picture?.__typename === 'NftImage') {
    return (
      profile?.metadata?.picture?.image?.raw.uri ??
      profile?.metadata?.picture?.image.optimized?.uri ??
      stampFyiUrl
    );
  }

  return stampFyiUrl;
};

export default getAvatarUrl;
