import { useAccessStore } from 'src/store/access';
import { useAppStore } from 'src/store/app';
import { useModePersistStore } from 'src/store/mode';

const useStaffMode = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const isStaff = useAccessStore((state) => state.isStaff);
  const staffMode = useModePersistStore((state) => state.staffMode);
  const allowed = currentProfile ? isStaff && staffMode : false;

  return { allowed };
};

export default useStaffMode;
