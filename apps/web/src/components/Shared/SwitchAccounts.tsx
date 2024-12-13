import errorToast from "@helpers/errorToast";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Errors } from "@hey/data/errors";
import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import {
  type Account,
  useAccountsAvailableQuery,
  useSwitchAccountMutation
} from "@hey/indexer";
import { ErrorMessage, H4, Image, Spinner } from "@hey/ui";
import cn from "@hey/ui/cn";
import { useRouter } from "next/router";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { signIn, signOut } from "src/store/persisted/useAuthStore";
import { useAccount } from "wagmi";
import WalletSelector from "./Auth/WalletSelector";
import Loader from "./Loader";

const SwitchAccounts: FC = () => {
  const { reload } = useRouter();
  const { currentAccount } = useAccountStore();
  const [isLoading, setIsLoading] = useState(false);
  const [loggingInAccountId, setLoggingInAccountId] = useState<null | string>(
    null
  );
  const { address } = useAccount();

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const { data, error, loading } = useAccountsAvailableQuery({
    variables: {
      lastLoggedInAccountRequest: { address },
      accountsAvailableRequest: { managedBy: address }
    }
  });
  const [switchAccount] = useSwitchAccountMutation();

  if (loading) {
    return <Loader className="my-5" message="Loading Accounts" />;
  }

  const accountsAvailable = data?.accountsAvailable.items || [];

  const handleSwitchAccount = async (account: string) => {
    try {
      setLoggingInAccountId(account);
      setIsLoading(true);

      const auth = await switchAccount({ variables: { request: { account } } });

      if (auth.data?.switchAccount.__typename === "AuthenticationTokens") {
        const accessToken = auth.data?.switchAccount.accessToken;
        const refreshToken = auth.data?.switchAccount.refreshToken;
        const idToken = auth.data?.switchAccount.idToken;
        signOut();
        signIn({ accessToken, idToken, refreshToken });
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
        title="Failed to load accounts"
      />
      {accountsAvailable.map((accountAvailable, index) => (
        <button
          className="flex w-full cursor-pointer items-center justify-between space-x-2 rounded-lg py-3 pr-4 pl-3 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          key={accountAvailable?.account.address}
          onClick={async () => {
            const selectedAccount = accountsAvailable[index].account as Account;
            await handleSwitchAccount(selectedAccount.address);
          }}
          type="button"
        >
          <span className="flex items-center space-x-2">
            <Image
              alt={accountAvailable.account.address}
              className="size-6 rounded-full border dark:border-gray-700"
              height={20}
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
              {
                getAccount(accountAvailable.account as Account)
                  .usernameWithPrefix
              }
            </div>
          </span>
          {isLoading &&
          accountAvailable.account.address === loggingInAccountId ? (
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
