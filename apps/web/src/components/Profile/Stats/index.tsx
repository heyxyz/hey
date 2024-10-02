import type { FC } from "react";
import ProfileStats from "./ProfileStats";

interface StatsProps {
  profileId: string;
}

const Stats: FC<StatsProps> = ({ profileId }) => {
  return (
    <div className="space-y-5">
      <ProfileStats profileId={profileId} />
    </div>
  );
};

export default Stats;
