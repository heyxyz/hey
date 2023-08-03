import isStaff from '@lenster/lib/isStaff';
import { useAppStore } from 'src/store/app';
import { useModePersistStore } from 'src/store/mode';

const useStaffMode = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const staffMode = useModePersistStore((state) => state.staffMode);
  const allowed = currentProfile
    ? isStaff(currentProfile?.id) && staffMode
    : false;

  return { allowed };
};

export default useStaffMode;
