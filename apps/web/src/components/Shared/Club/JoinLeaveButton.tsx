import type { Club } from "@hey/types/club";
import type { FC } from "react";

import { useEffect, useState } from "react";

import Join from "./Join";
import Leave from "./Leave";

interface JoinLeaveButtonProps {
  club: Club;
  small?: boolean;
}

const JoinLeaveButton: FC<JoinLeaveButtonProps> = ({ club, small = false }) => {
  const [joined, setJoined] = useState(club.isMember);

  useEffect(() => {
    setJoined(club.isMember);
  }, [club.isMember]);

  return joined ? (
    <Leave id={club.id} setJoined={setJoined} small={small} />
  ) : (
    <Join id={club.id} setJoined={setJoined} small={small} />
  );
};

export default JoinLeaveButton;
