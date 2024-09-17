import P2PRecommendation from "@components/Shared/Profile/P2PRecommendation";
import type { Profile } from "@hey/lens";
import type { FC } from "react";

interface GardenerToolProps {
  profile: Profile;
}

const GardenerTool: FC<GardenerToolProps> = ({ profile }) => {
  return (
    <div className="space-y-2.5">
      <div className="font-bold">Gardener Tool</div>
      <div>
        <P2PRecommendation profile={profile} />
      </div>
    </div>
  );
};

export default GardenerTool;
