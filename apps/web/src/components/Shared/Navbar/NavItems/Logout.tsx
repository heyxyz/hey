import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { PROFILE } from '@hey/data/tracking';
import { useRevokeAuthenticationMutation } from '@hey/lens';
import cn from '@hey/ui/cn';
import type { FC } from 'react';
import { useState } from 'react';
import { useDisconnect } from 'wagmi';

import errorToast from '@/lib/errorToast';
import getCurrentSession from '@/lib/getCurrentSession';
import { Leafwatch } from '@/lib/leafwatch';
import { usePreferencesStore } from '@/store/non-persisted/usePreferencesStore';
import { signOut } from '@/store/persisted/useAuthStore';

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
  const { authorizationId } = getCurrentSession();

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
        variables: { request: { authorizationId } }
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
        'flex w-full items-center space-x-1.5 px-2 py-1.5 text-left text-sm text-gray-700 dark:text-gray-200',
        className
      )}
      disabled={revoking}
    >
      <ArrowRightOnRectangleIcon className="h-4 w-4" />
      <div>Logout</div>
    </button>
  );
};

export default Logout;
