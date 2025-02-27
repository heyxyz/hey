import errorToast from "@helpers/errorToast";
import getCurrentSession from "@helpers/getCurrentSession";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { useRevokeAuthenticationMutation } from "@hey/indexer";
import cn from "@hey/ui/cn";
import { useRouter } from "next/router";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { signOut } from "src/store/persisted/useAuthStore";
import { usePreferencesStore } from "src/store/persisted/usePreferencesStore";

interface LogoutProps {
  className?: string;
  onClick?: () => void;
}

const Logout: FC<LogoutProps> = ({ className = "", onClick }) => {
  const { reload } = useRouter();
  const { resetPreferences } = usePreferencesStore();
  const [revoking, setRevoking] = useState(false);
  const { authenticationId } = getCurrentSession();

  const onError = (error: any) => {
    setRevoking(false);
    errorToast(error);
  };

  const [revokeAuthentication] = useRevokeAuthenticationMutation({ onError });

  const handleLogout = async () => {
    try {
      setRevoking(true);
      toast.promise(
        revokeAuthentication({
          variables: { request: { authenticationId } },
          onCompleted: () => {
            resetPreferences();
            signOut();
            reload();
          }
        }),
        {
          loading: "Logging out...",
          success: "Logged out successfully",
          error: "Failed to log out"
        }
      );
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
