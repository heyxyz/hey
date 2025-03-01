import {
  getMembershipApprovalDetails,
  getSimplePaymentDetails
} from "@helpers/rules";
import type { GroupFragment, GroupRules } from "@hey/indexer";
import { Button } from "@hey/ui";
import type { FC } from "react";
import { useSuperJoinModalStore } from "src/store/non-persisted/modal/useSuperJoinModalStore";
import Join from "./Join";

interface JoinWithRulesCheckProps {
  group: GroupFragment;
  setJoined: (joined: boolean) => void;
  small: boolean;
}

const JoinWithRulesCheck: FC<JoinWithRulesCheckProps> = ({
  group,
  setJoined,
  small
}) => {
  const { setShowSuperJoinModal } = useSuperJoinModalStore();
  const { assetContract: requiredSimplePayment } = getSimplePaymentDetails(
    group.rules as GroupRules
  );
  const requiresMembershipApproval = getMembershipApprovalDetails(
    group.rules as GroupRules
  );

  if (requiredSimplePayment) {
    return (
      <Button
        aria-label="Super Join"
        onClick={() => setShowSuperJoinModal(true, group)}
        outline
        size={small ? "sm" : "md"}
      >
        Super Join
      </Button>
    );
  }

  return (
    <Join
      group={group}
      setJoined={setJoined}
      small={small}
      title={requiresMembershipApproval ? "Request to join" : "Join"}
    />
  );
};

export default JoinWithRulesCheck;
