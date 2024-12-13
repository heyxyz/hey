import SearchAccounts from "@components/Shared/SearchAccounts";
import ToggleWithHelper from "@components/Shared/ToggleWithHelper";
import errorToast from "@helpers/errorToast";
import { ADDRESS_PLACEHOLDER } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import selfFundedTransactionData from "@hey/helpers/selfFundedTransactionData";
import sponsoredTransactionData from "@hey/helpers/sponsoredTransactionData";
import { useAddAccountManagerMutation } from "@hey/indexer";
import { OptmisticTransactionType } from "@hey/types/enums";
import { Button } from "@hey/ui";
import type { Dispatch, FC, SetStateAction } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { addSimpleOptimisticTransaction } from "src/store/persisted/useTransactionStore";
import { isAddress } from "viem";
import { sendEip712Transaction, sendTransaction } from "viem/zksync";
import { useWalletClient } from "wagmi";

interface AddAccountManagerProps {
  setShowAddManagerModal: Dispatch<SetStateAction<boolean>>;
}

const AddAccountManager: FC<AddAccountManagerProps> = ({
  setShowAddManagerModal
}) => {
  const { currentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();

  const [manager, setManager] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [canExecuteTransactions, setCanExecuteTransactions] = useState(true);
  const [canSetMetadataUri, setCanSetMetadataUri] = useState(true);
  const [canTransferNative, setCanTransferNative] = useState(true);
  const [canTransferTokens, setCanTransferTokens] = useState(true);

  const { data: walletClient } = useWalletClient();

  const onCompleted = (hash: string) => {
    setIsLoading(false);
    setShowAddManagerModal(false);
    addSimpleOptimisticTransaction(
      hash,
      OptmisticTransactionType.AddAccountManager
    );
    toast.success("Account manager added");
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const [addAccountManager] = useAddAccountManagerMutation({
    onCompleted: async ({ addAccountManager }) => {
      if (walletClient) {
        try {
          if (addAccountManager.__typename === "SponsoredTransactionRequest") {
            const hash = await sendEip712Transaction(walletClient, {
              account: walletClient.account,
              ...sponsoredTransactionData(addAccountManager.raw)
            });

            return onCompleted(hash);
          }

          if (addAccountManager.__typename === "SelfFundedTransactionRequest") {
            const hash = await sendTransaction(walletClient, {
              account: walletClient.account,
              ...selfFundedTransactionData(addAccountManager.raw)
            });

            return onCompleted(hash);
          }
        } catch (error) {
          return onError(error);
        }
      }
    },
    onError
  });

  const handleAddManager = async () => {
    if (!currentAccount) {
      return toast.error(Errors.SignWallet);
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    setIsLoading(true);

    return await addAccountManager({
      variables: {
        request: {
          address: manager,
          permissions: {
            canExecuteTransactions,
            canSetMetadataUri,
            canTransferNative,
            canTransferTokens
          }
        }
      }
    });
  };

  return (
    <div className="space-y-4 p-5">
      <SearchAccounts
        error={manager.length > 0 && !isAddress(manager)}
        hideDropdown={isAddress(manager)}
        onChange={(event) => setManager(event.target.value)}
        onAccountSelected={(account) => setManager(account.address)}
        placeholder={`${ADDRESS_PLACEHOLDER} or wagmi`}
        value={manager}
      />
      <div className="space-y-3 py-3">
        <ToggleWithHelper
          description="Allow the manager to execute transactions"
          heading="Can execute transactions"
          on={canExecuteTransactions}
          setOn={setCanExecuteTransactions}
        />
        <ToggleWithHelper
          description="Allow the manager to set the metadata URI"
          heading="Can set metadata URI"
          on={canSetMetadataUri}
          setOn={setCanSetMetadataUri}
        />
        <ToggleWithHelper
          description="Allow the manager to transfer native tokens"
          heading="Can transfer native tokens"
          on={canTransferNative}
          setOn={setCanTransferNative}
        />
        <ToggleWithHelper
          description="Allow the manager to transfer tokens"
          heading="Can transfer tokens"
          on={canTransferTokens}
          setOn={setCanTransferTokens}
        />
      </div>
      <div className="flex">
        <Button
          className="ml-auto"
          disabled={isLoading || !isAddress(manager)}
          onClick={handleAddManager}
          type="submit"
        >
          Add manager
        </Button>
      </div>
    </div>
  );
};

export default AddAccountManager;
