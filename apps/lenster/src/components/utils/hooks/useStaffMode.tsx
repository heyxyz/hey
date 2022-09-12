import isStaff from '@lib/isStaff';
import { useAppPersistStore, useAppStore } from 'src/store/app';

const useStaffMode = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const staffMode = useAppPersistStore((state) => state.staffMode);
  const allowed = currentProfile ? isStaff(currentProfile?.id) && staffMode : false;

  return { allowed };
};

export default useStaffMode;
