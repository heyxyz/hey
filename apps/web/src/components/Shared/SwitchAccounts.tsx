import errorToast from "@helpers/errorToast";
import { Leafwatch } from "@helpers/leafwatch";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Errors } from "@hey/data/errors";
import { ACCOUNT } from "@hey/data/tracking";
import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import getLennyURL from "@hey/helpers/getLennyURL";
import {
  type Account,
  useAccountsAvailableQuery,
  useAuthenticateMutation,
  useChallengeMutation
} from "@hey/indexer";
import { ErrorMessage, H4, Image, Spinner } from "@hey/ui";
import cn from "@hey/ui/cn";
import { useRouter } from "next/router";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { signIn, signOut } from "src/store/persisted/useAuthStore";
import { useAccount, useSignMessage } from "wagmi";
import WalletSelector from "./Auth/WalletSelector";
import Loader from "./Loader";

const SwitchAccounts: FC = () => {
  const { reload } = useRouter();
  const { currentAccount } = useAccountStore();
  const [isLoading, setIsLoading] = useState(false);
  const [loggingInProfileId, setLoggingInProfileId] = useState<null | string>(
    null
  );
  const { address } = useAccount();

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const { signMessageAsync } = useSignMessage({ mutation: { onError } });

  const { data, error, loading } = useAccountsAvailableQuery({
    variables: {
      lastLoggedInAccountRequest: { address },
      accountsAvailableRequest: { managedBy: address }
    }
  });
  const [loadChallenge] = useChallengeMutation();
  const [authenticate] = useAuthenticateMutation();

  if (loading) {
    return <Loader className="my-5" message="Loading Profiles" />;
  }

  const accountsAvailable = data?.accountsAvailable.items || [];

  const handleSwitchProfile = async (account: string) => {
    try {
      setLoggingInProfileId(account);
      setIsLoading(true);
      // Get challenge
      const challenge = await loadChallenge({
        variables: {
          request: { accountOwner: { account, owner: address } }
        }
      });

      if (!challenge?.data?.challenge?.text) {
        return toast.error(Errors.SomethingWentWrong);
      }

      // Get signature
      const signature = await signMessageAsync({
        message: challenge?.data?.challenge?.text
      });

      // Auth profile and set cookies
      const auth = await authenticate({
        variables: { request: { id: challenge.data.challenge.id, signature } }
      });

      if (auth.data?.authenticate.__typename === "AuthenticationTokens") {
        const accessToken = auth.data?.authenticate.accessToken;
        const refreshToken = auth.data?.authenticate.refreshToken;
        const idToken = auth.data?.authenticate.idToken;
        signOut();
        signIn({ accessToken, idToken, refreshToken });
        Leafwatch.track(ACCOUNT.SWITCH_ACCOUNT, { address });
        return reload();
      }

      return toast.error(Errors.SomethingWentWrong);
    } catch (error) {
      onError(error);
    }
  };

  if (!address) {
    return (
      <div className="m-5 space-y-5">
        <div className="space-y-2">
          <H4>Connect your wallet.</H4>
          <div className="ld-text-gray-500 text-sm">
            Seems like you are disconnected from the wallet or trying to access
            this from a different wallet. Please switch to the correct wallet.
          </div>
        </div>
        <WalletSelector />
      </div>
    );
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto p-2">
      <ErrorMessage
        className="m-2"
        error={error}
        title="Failed to load profiles"
      />
      {accountsAvailable.map((accountAvailable, index) => (
        <button
          className="flex w-full cursor-pointer items-center justify-between space-x-2 rounded-lg py-3 pr-4 pl-3 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          key={accountAvailable?.account.address}
          onClick={async () => {
            const selectedProfile = accountsAvailable[index].account as Account;
            await handleSwitchProfile(selectedProfile.address);
          }}
          type="button"
        >
          <span className="flex items-center space-x-2">
            <Image
              alt={accountAvailable.account.address}
              className="size-6 rounded-full border dark:border-gray-700"
              height={20}
              onError={({ currentTarget }) => {
                currentTarget.src = getLennyURL(
                  accountAvailable.account.address
                );
              }}
              src={getAvatar(accountAvailable.account)}
              width={20}
            />
            <div
              className={cn(
                currentAccount?.address === accountAvailable.account.address &&
                  "font-bold",
                "truncate"
              )}
            >
              {getAccount(accountAvailable.account as Account).slugWithPrefix}
            </div>
          </span>
          {isLoading &&
          accountAvailable.account.address === loggingInProfileId ? (
            <Spinner size="xs" />
          ) : currentAccount?.address === accountAvailable.account.address ? (
            <CheckCircleIcon className="size-5 text-green-500" />
          ) : null}
        </button>
      ))}
    </div>
  );
};

export default SwitchAccounts;
