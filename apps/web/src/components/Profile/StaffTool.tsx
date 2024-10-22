import Suspend from "@components/Shared/Profile/Suspend";
import type { Profile } from "@hey/lens";
import type { FC } from "react";

interface StaffToolProps {
  profile: Profile;
}

const StaffTool: FC<StaffToolProps> = ({ profile }) => {
  return (
    <div className="space-y-2.5">
      <div className="font-bold">Staff Tool</div>
      <div className="space-y-2 pt-2 font-bold">
        <Suspend id={profile.id} />
      </div>
    </div>
  );
};

export default StaffTool;
