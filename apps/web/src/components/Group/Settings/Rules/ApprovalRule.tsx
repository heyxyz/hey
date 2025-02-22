import ToggleWithHelper from "@components/Shared/ToggleWithHelper";
import errorToast from "@helpers/errorToast";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { Errors } from "@hey/data/errors";
import {
  type Group,
  GroupRuleType,
  useUpdateGroupRulesMutation
} from "@hey/indexer";
import { type FC, useState } from "react";
import toast from "react-hot-toast";
import useTransactionLifecycle from "src/hooks/useTransactionLifecycle";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";

interface ApprovalRuleProps {
  group: Group;
}

const ApprovalRule: FC<ApprovalRuleProps> = ({ group }) => {
  const { isSuspended } = useAccountStatus();
  const [isLoading, setIsLoading] = useState(false);
  const handleTransactionLifecycle = useTransactionLifecycle();

  const approvalRule = [...group.rules.required, ...group.rules.anyOf].find(
    (rule) => rule.type === GroupRuleType.MembershipApproval
  );
  const isApprovalRuleEnabled = approvalRule !== undefined;

  const onCompleted = () => {
    setIsLoading(false);
    toast.success("Approval rule updated");
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
          ...(isApprovalRuleEnabled
            ? { toRemove: [approvalRule.id] }
            : {
                toAdd: {
                  required: [{ membershipApprovalRule: { enable: true } }]
                }
              })
        }
      }
    });
  };

  return (
    <ToggleWithHelper
      heading="Membership Approval"
      description="Members must be approved by the group owner to join"
      disabled={isLoading}
      icon={<PlusCircleIcon className="size-5" />}
      on={isApprovalRuleEnabled}
      setOn={handleUpdateRule}
    />
  );
};

export default ApprovalRule;
