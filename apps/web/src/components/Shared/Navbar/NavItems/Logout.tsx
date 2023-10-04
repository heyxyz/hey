import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { PROFILE } from '@hey/data/tracking';
import resetAuthData from '@hey/lib/resetAuthData';
import cn from '@hey/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';
import { useDisconnectXmtp } from 'src/hooks/useXmtpClient';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { usePreferencesStore } from 'src/store/preferences';
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
  const resetPreferences = usePreferencesStore(
    (state) => state.resetPreferences
  );
  const resetProfileGuardianInformation = useProfileGuardianInformationStore(
    (state) => state.resetProfileGuardianInformation
  );
  const setProfileId = useAppPersistStore((state) => state.setProfileId);

  const logout = () => {
    Leafwatch.track(PROFILE.LOGOUT);
    disconnectXmtp();
    setCurrentProfile(null);
    resetPreferences();
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
      className={cn(
        'flex w-full px-2 py-1.5 text-left text-sm text-gray-700 dark:text-gray-200',
        className
      )}
    >
      <div className="flex items-center space-x-1.5">
        <div>
          <ArrowRightOnRectangleIcon className="h-4 w-4" />
        </div>
        <div>
          <Trans>Logout</Trans>
        </div>
      </div>
    </button>
  );
};

export default Logout;
