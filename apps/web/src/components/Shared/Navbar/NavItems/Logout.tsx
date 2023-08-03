import { LogoutIcon } from '@heroicons/react/outline';
import { PROFILE } from '@lenster/data/tracking';
import { Leafwatch } from '@lib/leafwatch';
import resetAuthData from '@lib/resetAuthData';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import type { FC } from 'react';
import { useDisconnectXmtp } from 'src/hooks/useXmtpClient';
import { useAppStore } from 'src/store/app';
import useAuthPersistStore from 'src/store/auth';
import { useProfileGuardianInformationStore } from 'src/store/profile-guardian-information';
import { useDisconnect } from 'wagmi';

interface LogoutProps {
  onClick?: () => void;
  className?: string;
}

const Logout: FC<LogoutProps> = ({ onClick, className = '' }) => {
  const { disconnect } = useDisconnect();
  const disconnectXmtp = useDisconnectXmtp();

  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const resetProfileGuardianInformation = useProfileGuardianInformationStore(
    (state) => state.resetProfileGuardianInformation
  );
  const setProfileId = useAuthPersistStore((state) => state.setProfileId);

  const logout = () => {
    Leafwatch.track(PROFILE.LOGOUT);
    disconnectXmtp();
    setCurrentProfile(null);
    resetProfileGuardianInformation();
    setProfileId(null);
    resetAuthData();
    disconnect?.();
  };

  return (
    <button
      type="button"
      onClick={() => {
        logout();
        onClick?.();
      }}
      className={clsx(
        'flex w-full px-4 py-1.5 text-sm text-gray-700 dark:text-gray-200',
        className
      )}
    >
      <div className="flex items-center space-x-1.5">
        <LogoutIcon className="h-4 w-4" />
        <div>
          <Trans>Logout</Trans>
        </div>
      </div>
    </button>
  );
};

export default Logout;
