import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { PROFILE } from '@hey/data/tracking';
import { useRevokeAuthenticationMutation } from '@hey/lens';
import resetAuthData from '@hey/lib/resetAuthData';
import cn from '@hey/ui/cn';
import errorToast from '@lib/errorToast';
import getCurrentSessionId from '@lib/getCurrentSessionId';
import { Leafwatch } from '@lib/leafwatch';
import type { FC } from 'react';
import { useState } from 'react';
import { useAppPersistStore } from 'src/store/useAppPersistStore';
import { useAppStore } from 'src/store/useAppStore';
import { usePreferencesStore } from 'src/store/usePreferencesStore';
import { useDisconnect } from 'wagmi';

interface LogoutProps {
  onClick?: () => void;
  className?: string;
}

const Logout: FC<LogoutProps> = ({ onClick, className = '' }) => {
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const resetPreferences = usePreferencesStore(
    (state) => state.resetPreferences
  );
  const setProfileId = useAppPersistStore((state) => state.setProfileId);
  const [revoking, setRevoking] = useState(false);

  const { disconnect } = useDisconnect();

  const onError = (error: any) => {
    setRevoking(false);
    errorToast(error);
  };

  const [revokeAuthentication] = useRevokeAuthenticationMutation({
    onCompleted: () => {
      Leafwatch.track(PROFILE.LOGOUT);
      setCurrentProfile(null);
      resetPreferences();
      setProfileId(null);
      resetAuthData();
      disconnect?.();
    },
    onError
  });

  const logout = async () => {
    try {
      setRevoking(true);
      return await revokeAuthentication({
        variables: { request: { authorizationId: getCurrentSessionId() } }
      });
    } catch (error) {
      onError(error);
    } finally {
      setRevoking(false);
    }
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
      disabled={revoking}
    >
      <div className="flex items-center space-x-1.5">
        <div>
          <ArrowRightOnRectangleIcon className="h-4 w-4" />
        </div>
        <div>Logout</div>
      </div>
    </button>
  );
};

export default Logout;
