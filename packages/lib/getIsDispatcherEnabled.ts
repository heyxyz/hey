import { OLD_LENS_RELAYER_ADDRESS } from '@hey/data/constants';
import type { Profile } from '@hey/lens';

const getIsDispatcherEnabled = (profile: Profile | null): boolean => {
  if (!profile?.dispatcher?.canUseRelay) {
    return false;
  }

  const address = profile.dispatcher.address?.toLocaleLowerCase();
  const oldRelayer = OLD_LENS_RELAYER_ADDRESS.toLowerCase();

  return address !== oldRelayer;
};

export default getIsDispatcherEnabled;
