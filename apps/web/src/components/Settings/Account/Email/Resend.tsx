import errorToast from "@helpers/errorToast";
import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { HEY_API_URL } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import { Button } from "@hey/ui";
import axios from "axios";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { usePreferencesStore } from "src/store/persisted/usePreferencesStore";

const Resend: FC = () => {
  const { currentAccount } = useAccountStore();
  const { email, emailVerified } = usePreferencesStore();
  const { isSuspended } = useAccountStatus();
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  if (!email || emailVerified) {
    return null;
  }

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const handleResendVerification = async () => {
    if (!currentAccount) {
      return toast.error(Errors.SignWallet);
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    try {
      setIsLoading(true);
      await axios.post(
        `${HEY_API_URL}/email/update`,
        { email, resend: true },
        { headers: getAuthApiHeaders() }
      );
      setSent(true);

      return toast.success("Email verification sent to your email!");
    } catch (error) {
      onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-5 space-y-1 rounded-xl border-2 border-gray-500/50 bg-gray-50 p-4 text-sm dark:bg-gray-900/10">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-medium">Resend verification email</h3>
      </div>
      <div className="ld-text-gray-500 break-words">
        You will receive an email with a verification link to confirm your email
        address.
      </div>
      <div>
        <Button
          className="mt-2"
          disabled={isLoading || sent}
          onClick={handleResendVerification}
          size="sm"
        >
          Resend verification
        </Button>
      </div>
    </div>
  );
};

export default Resend;
