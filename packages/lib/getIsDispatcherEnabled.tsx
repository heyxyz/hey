import type { Profile } from 'lens';

const LENS_RELAYER_ADDRESS = '0xD1FecCF6881970105dfb2b654054174007f0e07E';

const getIsDispatcherEnabled = (profile: Profile | null) => {
  return (
    profile?.dispatcher?.canUseRelay &&
    profile.dispatcher?.address?.toLocaleLowerCase() !== LENS_RELAYER_ADDRESS.toLocaleLowerCase()
  );
};

export default getIsDispatcherEnabled;
