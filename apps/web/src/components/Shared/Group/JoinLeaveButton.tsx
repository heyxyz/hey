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
  const [joined, setJoined] = useState(group.isMember);

  useEffect(() => {
    setJoined(group.isMember);
  }, [group.isMember]);

  return joined ? (
    <Leave address={group.address} setJoined={setJoined} small={small} />
  ) : (
    <Join address={group.address} setJoined={setJoined} small={small} />
  );
};

export default JoinLeaveButton;
