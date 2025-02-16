import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { Group } from "@hey/indexer";
import type { FC } from "react";
import { useEffect, useState } from "react";
import Join from "./Join";
import Leave from "./Leave";

interface JoinLeaveButtonProps {
  hideJoinButton?: boolean;
  hideLeaveButton?: boolean;
  group: Group;
  small?: boolean;
}

const JoinLeaveButton: FC<JoinLeaveButtonProps> = ({
  hideJoinButton = false,
  hideLeaveButton = false,
  group,
  small = false
}) => {
  const [joined, setJoined] = useState(group.operations?.isMember);

  useEffect(() => {
    setJoined(group.operations?.isMember);
  }, [group.operations?.isMember]);

  return (
    <div className="contents" onClick={stopEventPropagation}>
      {!hideJoinButton &&
        (joined ? null : (
          <Join group={group} setJoined={setJoined} small={small} />
        ))}
      {!hideLeaveButton &&
        (joined ? (
          <Leave group={group} setJoined={setJoined} small={small} />
        ) : null)}
    </div>
  );
};

export default JoinLeaveButton;
