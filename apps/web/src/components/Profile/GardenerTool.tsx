import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import P2PRecommendation from '@components/Shared/Profile/P2PRecommendation';
import { Card } from '@hey/ui';

interface GardenerToolProps {
  profile: Profile;
}

const GardenerTool: FC<GardenerToolProps> = ({ profile }) => {
  return (
    <Card
      as="aside"
      className="mb-4 space-y-2.5 border-yellow-400 !bg-yellow-300/20 p-5 text-yellow-600"
      forceRounded
    >
      <div className="font-bold">Gardener Tool</div>
      <div>
        <P2PRecommendation profile={profile} />
      </div>
    </Card>
  );
};

export default GardenerTool;
