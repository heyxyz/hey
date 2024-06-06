import type { Profile } from '@good/lens';
import type { FC } from 'react';

import { FeatureFlag } from '@good/data/feature-flags';
import { Card } from '@good/ui';
import isFeatureAvailable from '@helpers/isFeatureAvailable';

import CreatorTool from './CreatorTool';
import GardenerTool from './GardenerTool';

interface InternalToolsProps {
  profile: Profile;
}

const InternalTools: FC<InternalToolsProps> = ({ profile }) => {
  const hasGardenerToolAccess = isFeatureAvailable(FeatureFlag.Gardener);
  const hasCreatorToolAccess = isFeatureAvailable(FeatureFlag.Staff);

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
