import errorToast from "@helpers/errorToast";
import getCurrentSession from "@helpers/getCurrentSession";
import { Leafwatch } from "@helpers/leafwatch";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { AUTH } from "@hey/data/tracking";
import { useRevokeAuthenticationMutation } from "@hey/lens";
import cn from "@hey/ui/cn";
import { useRouter } from "next/router";
import type { FC } from "react";
import { useState } from "react";
import { signOut } from "src/store/persisted/useAuthStore";
import { usePreferencesStore } from "src/store/persisted/usePreferencesStore";
import { useDisconnect } from "wagmi";

interface LogoutProps {
  className?: string;
  onClick?: () => void;
}

const Logout: FC<LogoutProps> = ({ className = "", onClick }) => {
  const { reload } = useRouter();
  const { resetPreferences } = usePreferencesStore();
  const [revoking, setRevoking] = useState(false);

  const { disconnect } = useDisconnect();
  const { authorizationId } = getCurrentSession();

  const onError = (error: any) => {
    setRevoking(false);
    errorToast(error);
  };

  const [revokeAuthentication] = useRevokeAuthenticationMutation({ onError });

  const handleLogout = async () => {
    try {
      setRevoking(true);
      if (authorizationId) {
        await revokeAuthentication({
          variables: { request: { authorizationId } }
        });
      }
      Leafwatch.track(AUTH.LOGOUT);
      resetPreferences();
      signOut();
      disconnect?.();
      reload();
    } catch (error) {
      onError(error);
    } finally {
      setRevoking(false);
    }
  };

  return (
    <button
      className={cn(
        "flex w-full items-center space-x-1.5 px-2 py-1.5 text-left text-gray-700 text-sm dark:text-gray-200",
        className
      )}
      disabled={revoking}
      onClick={async () => {
        await handleLogout();
        onClick?.();
      }}
      type="button"
    >
      <ArrowRightStartOnRectangleIcon className="size-4" />
      <div>Logout</div>
    </button>
  );
};

export default Logout;
