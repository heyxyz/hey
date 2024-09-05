import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import { FeatureFlag } from '@hey/data/feature-flags';
import { Card } from '@hey/ui';
import { useFlag } from '@unleash/proxy-client-react';

import CreatorTool from './CreatorTool';
import GardenerTool from './GardenerTool';

interface InternalToolsProps {
  profile: Profile;
}

const InternalTools: FC<InternalToolsProps> = ({ profile }) => {
  const hasGardenerToolAccess = useFlag(FeatureFlag.Gardener);
  const hasCreatorToolAccess = useFlag(FeatureFlag.CreatorTools);

  if (!hasGardenerToolAccess && !hasCreatorToolAccess) {
    return null;
  }

  return (
    <Card
      as="aside"
      className="mb-4 space-y-5 border-yellow-400 !bg-yellow-300/20 p-5 text-yellow-600"
      forceRounded
    >
      {hasCreatorToolAccess && <CreatorTool profile={profile} />}
      {hasGardenerToolAccess && <GardenerTool profile={profile} />}
    </Card>
  );
};

export default InternalTools;
