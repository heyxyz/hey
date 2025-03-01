import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { GroupFragment } from "@hey/indexer";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import JoinWithRulesCheck from "./JoinWithRulesCheck";
import Leave from "./Leave";

interface JoinLeaveButtonProps {
  hideJoinButton?: boolean;
  hideLeaveButton?: boolean;
  group: GroupFragment;
  small?: boolean;
}

const JoinLeaveButton: FC<JoinLeaveButtonProps> = ({
  hideJoinButton = false,
  hideLeaveButton = false,
  group,
  small = false
}) => {
  const { currentAccount } = useAccountStore();
  const [joined, setJoined] = useState(group.operations?.isMember);

  useEffect(() => {
    setJoined(group.operations?.isMember);
  }, [group.operations?.isMember]);

  if (currentAccount?.address === group.owner) {
    return null;
  }

  return (
    <div className="contents" onClick={stopEventPropagation}>
      {!hideJoinButton &&
        (joined ? null : (
          <JoinWithRulesCheck
            group={group}
            setJoined={setJoined}
            small={small}
          />
        ))}
      {!hideLeaveButton &&
        (joined ? (
          <Leave group={group} setJoined={setJoined} small={small} />
        ) : null)}
    </div>
  );
};

export default JoinLeaveButton;
