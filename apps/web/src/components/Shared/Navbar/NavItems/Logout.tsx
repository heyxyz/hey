import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { PROFILE } from '@hey/data/tracking';
import { useRevokeAuthenticationMutation } from '@hey/lens';
import cn from '@hey/ui/cn';
import errorToast from '@lib/errorToast';
import getCurrentSessionId from '@lib/getCurrentSessionId';
import { Leafwatch } from '@lib/leafwatch';
import type { FC } from 'react';
import { memo, useState } from 'react';
import { signOut } from 'src/store/useAuthPersistStore';
import { usePreferencesStore } from 'src/store/usePreferencesStore';
import { useDisconnect } from 'wagmi';

interface LogoutProps {
  onClick?: () => void;
  className?: string;
}

const Logout: FC<LogoutProps> = ({ onClick, className = '' }) => {
  const resetPreferences = usePreferencesStore(
    (state) => state.resetPreferences
  );
  const [revoking, setRevoking] = useState(false);

  const { disconnect } = useDisconnect();

  const onError = (error: any) => {
    setRevoking(false);
    errorToast(error);
  };

  const [revokeAuthentication] = useRevokeAuthenticationMutation({
    onCompleted: () => {
      Leafwatch.track(PROFILE.LOGOUT);
      resetPreferences();
      signOut();
      disconnect?.();
      location.reload();
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
      onClick={async () => {
        await logout();
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

export default memo(Logout);
