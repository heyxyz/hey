import { useAppPersistStore, useAppStore } from 'src/store/app';
import isGardener from 'utils/isGardener';

const useModMode = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const modMode = useAppPersistStore((state) => state.modMode);
  const allowed = currentProfile ? isGardener(currentProfile?.id) && modMode : false;

  return { allowed };
};

export default useModMode;
