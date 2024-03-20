import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import { Button } from '@hey/ui';
import { useGlobalAlertStateStore } from 'src/store/non-persisted/useGlobalAlertStateStore';

interface UnblockProps {
  className?: string;
  profile: Profile;
}

const Unblock: FC<UnblockProps> = ({ className, profile }) => {
  const setShowBlockOrUnblockAlert = useGlobalAlertStateStore(
    (state) => state.setShowBlockOrUnblockAlert
  );

  return (
    <Button
      className={className}
      onClick={() => setShowBlockOrUnblockAlert(true, profile)}
    >
      Unblock
    </Button>
  );
};

export default Unblock;
