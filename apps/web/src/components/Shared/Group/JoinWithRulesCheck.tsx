import { getMembershipApprovalDetails } from "@helpers/group";
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
  const requiresMembershipApproval = getMembershipApprovalDetails(group.rules);

  if (
    group.operations?.canJoin.__typename === "GroupOperationValidationFailed"
  ) {
    return (
      <Button
        aria-label="Join"
        onClick={() => setShowJoinGroupModal(true, group)}
        outline
        size={small ? "sm" : "md"}
      >
        Join
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
