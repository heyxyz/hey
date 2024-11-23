import Loader from "@components/Shared/Loader";
import errorToast from "@helpers/errorToast";
import { Leafwatch } from "@helpers/leafwatch";
import { Errors } from "@hey/data/errors";
import { SETTINGS } from "@hey/data/tracking";
import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import type { Profile } from "@hey/lens";
import {
  useDefaultProfileQuery,
  useProfilesQuery,
  useSetDefaultProfileMutation
} from "@hey/lens";
import { Button, Card, CardHeader, Select } from "@hey/ui";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountStore } from "src/store/persisted/useAccountStore";

const DefaultAccount: FC = () => {
  const { currentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();
  const [selectedAccountId, setSelectedAccountId] = useState<null | string>(
    null
  );

  const onCompleted = () => {
    toast.success("Default account set");
    Leafwatch.track(SETTINGS.ACCOUNT.SET_DEFAULT_ACCOUNT);
  };

  const onError = (error: any) => {
    errorToast(error);
  };

  const { data: accountsData, loading: accountsLoading } = useProfilesQuery({
    variables: {
      request: { where: { ownedBy: currentAccount?.ownedBy.address } }
    }
  });

  const { data: defaultAccountData, loading: defaultAccountLoading } =
    useDefaultProfileQuery({
      variables: { request: { for: currentAccount?.ownedBy.address } }
    });

  const [setAccount, { loading }] = useSetDefaultProfileMutation({
    onCompleted,
    onError
  });

  const handleSetDefaultAccount = async () => {
    if (!currentAccount) {
      return toast.error(Errors.SignWallet);
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    try {
      return await setAccount({
        variables: { request: { profileId: selectedAccountId } }
      });
    } catch (error) {
      onError(error);
    }
  };

  if (accountsLoading || defaultAccountLoading) {
    return (
      <Card>
        <Loader className="my-10" message="Loading default account settings" />
      </Card>
    );
  }

  const accounts = accountsData?.profiles.items as Profile[];

  return (
    <Card>
      <CardHeader
        body="Set a default account that will be visible on places like DMs, Split Collects, and more."
        title="Set Default Account"
      />
      <div className="m-5 space-y-4">
        <div>
          <div className="label">Select Account</div>
          <Select
            defaultValue={defaultAccountData?.defaultProfile?.id}
            iconClassName="size-5 rounded-full border bg-gray-200 dark:border-gray-700"
            onChange={(value) => setSelectedAccountId(value)}
            options={accounts?.map((account) => ({
              icon: getAvatar(account),
              label: getAccount(account).slugWithPrefix,
              selected:
                account.id ===
                (selectedAccountId || defaultAccountData?.defaultProfile?.id),
              value: account.id
            }))}
          />
        </div>
        <div className="flex">
          <Button
            className="ml-auto"
            disabled={loading}
            onClick={handleSetDefaultAccount}
            type="submit"
          >
            Set Default Account
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DefaultAccount;
