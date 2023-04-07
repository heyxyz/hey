import { OLD_LENS_RELAYER_ADDRESS } from 'data';
import type { Profile } from 'lens';

const getIsDispatcherEnabled = (profile: Profile | null) => {
  return (
    profile?.dispatcher?.canUseRelay &&
    profile.dispatcher?.address?.toLocaleLowerCase() !== OLD_LENS_RELAYER_ADDRESS.toLocaleLowerCase()
  );
};

export default getIsDispatcherEnabled;
