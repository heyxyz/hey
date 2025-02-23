import {
  getMembershipApprovalDetails,
  getSimplePaymentDetails
} from "@helpers/group";
import type { Group } from "@hey/indexer";
import { Button } from "@hey/ui";
import type { FC } from "react";
import { useJoinGroupModalStore } from "src/store/non-persisted/modal/useJoinGroupModalStore";
import Join from "./Join";

interface JoinWithRulesCheckProps {
  group: Group;
  setJoined: (joined: boolean) => void;
  small: boolean;
}

const JoinWithRulesCheck: FC<JoinWithRulesCheckProps> = ({
  group,
  setJoined,
  small
}) => {
  const { setShowJoinGroupModal } = useJoinGroupModalStore();
  const { assetContract: requiredSimplePayment } = getSimplePaymentDetails(
    group.rules
  );
  const requiresMembershipApproval = getMembershipApprovalDetails(group.rules);

  if (requiredSimplePayment) {
    return (
      <Button
        aria-label="Super Join"
        onClick={() => setShowJoinGroupModal(true, group)}
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
      label={requiresMembershipApproval ? "Request to join" : "Join"}
    />
  );
};

export default JoinWithRulesCheck;
