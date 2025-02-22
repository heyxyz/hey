import errorToast from "@helpers/errorToast";
import { Errors } from "@hey/data/errors";
import {
  type Group,
  GroupRuleType,
  useUpdateGroupRulesMutation
} from "@hey/indexer";
import { OptimisticTxType } from "@hey/types/enums";
import { Card, CardHeader } from "@hey/ui";
import { type FC, useState } from "react";
import toast from "react-hot-toast";
import useTransactionLifecycle from "src/hooks/useTransactionLifecycle";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { addSimpleOptimisticTransaction } from "src/store/persisted/useTransactionStore";

interface PaymentRuleProps {
  group: Group;
}

const PaymentRule: FC<PaymentRuleProps> = ({ group }) => {
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
            : { toAdd: { required: [{ banAccountRule: { enable: true } }] } })
        }
      }
    });
  };

  return (
    <Card>
      <CardHeader
        body="Update the payment rule, so accounts can only join if they pay a certain amount."
        title="Payment Rule"
      />
      <div className="m-5 space-y-5">WIP</div>
    </Card>
  );
};

export default PaymentRule;
