import isGardener from '@lenster/lib/isGardener';
import { useAppStore } from 'src/store/app';
import { useModePersistStore } from 'src/store/mode';

const useModMode = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const modMode = useModePersistStore((state) => state.modMode);
  const allowed = currentProfile
    ? isGardener(currentProfile?.id) && modMode
    : false;

  return { allowed };
};

export default useModMode;
