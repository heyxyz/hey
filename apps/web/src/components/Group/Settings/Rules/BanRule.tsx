import ToggleWithHelper from "@components/Shared/ToggleWithHelper";
import errorToast from "@helpers/errorToast";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { Errors } from "@hey/data/errors";
import {
  type Group,
  GroupRuleType,
  useUpdateGroupRulesMutation
} from "@hey/indexer";
import { OptimisticTxType } from "@hey/types/enums";
import { type FC, useState } from "react";
import toast from "react-hot-toast";
import useTransactionLifecycle from "src/hooks/useTransactionLifecycle";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { addSimpleOptimisticTransaction } from "src/store/persisted/useTransactionStore";

interface BanRuleProps {
  group: Group;
}

const BanRule: FC<BanRuleProps> = ({ group }) => {
  const { isSuspended } = useAccountStatus();
  const [isLoading, setIsLoading] = useState(false);
  const handleTransactionLifecycle = useTransactionLifecycle();

  const banRule = [...group.rules.required, ...group.rules.anyOf].find(
    (rule) => rule.type === GroupRuleType.BanAccount
  );
  const isBanRuleEnabled = banRule !== undefined;

  const onCompleted = (hash: string) => {
    addSimpleOptimisticTransaction(hash, OptimisticTxType.UPDATE_GROUP_RULES);
    setIsLoading(false);
    toast.success("Ban rule updated");
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const [updateGroupRules] = useUpdateGroupRulesMutation({
    onCompleted: async ({ updateGroupRules }) => {
      return await handleTransactionLifecycle({
        transactionData: updateGroupRules,
        onCompleted,
        onError
      });
    },
    onError
  });

  const handleUpdateRule = () => {
    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    setIsLoading(true);

    return updateGroupRules({
      variables: {
        request: {
          group: group.address,
          ...(isBanRuleEnabled
            ? { toRemove: [banRule.id] }
            : { toAdd: { required: [{ banAccountRule: null }] } })
        }
      }
    });
  };

  return (
    <ToggleWithHelper
      description="Ban accounts from joining the group"
      disabled={isLoading}
      heading="Ban Rule"
      icon={<PlusCircleIcon className="size-5" />}
      on={isBanRuleEnabled}
      setOn={handleUpdateRule}
    />
  );
};

export default BanRule;
