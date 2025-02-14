import type { Group } from "@hey/indexer";
import type { FC } from "react";
import { useEffect, useState } from "react";
import Join from "./Join";
import Leave from "./Leave";

interface JoinLeaveButtonProps {
  group: Group;
  small?: boolean;
}

const JoinLeaveButton: FC<JoinLeaveButtonProps> = ({
  group,
  small = false
}) => {
  const [joined, setJoined] = useState(group.operations?.isMember);

  useEffect(() => {
    setJoined(group.operations?.isMember);
  }, [group.operations?.isMember]);

  return joined ? (
    <Leave group={group} setJoined={setJoined} small={small} />
  ) : (
    <Join group={group} setJoined={setJoined} small={small} />
  );
};

export default JoinLeaveButton;
