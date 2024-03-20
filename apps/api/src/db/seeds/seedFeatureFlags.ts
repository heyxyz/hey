import { FeatureFlag } from '@hey/data/feature-flags';

import {
  GARDENER_FEATURE_ID,
  GARDENER_MODE_FEATURE_ID,
  STAFF_FEATURE_ID,
  STAFF_MODE_FEATURE_ID,
  STAFF_PICK_FEATURE_ID,
  VERIFIED_FEATURE_ID
} from '../../lib/constants';
import { prisma } from '../seed';

const seedFeatureFlags = async (): Promise<number> => {
  const featureFlags = await prisma.feature.createMany({
    data: [
      {
        id: GARDENER_FEATURE_ID,
        key: FeatureFlag.Gardener,
        type: 'PERMISSION'
      },
      {
        id: STAFF_MODE_FEATURE_ID,
        key: FeatureFlag.StaffMode,
        type: 'MODE'
      },
      {
        id: GARDENER_MODE_FEATURE_ID,
        key: FeatureFlag.GardenerMode,
        type: 'MODE'
      },
      {
        id: VERIFIED_FEATURE_ID,
        key: FeatureFlag.Verified,
        type: 'PERMISSION'
      },
      {
        id: STAFF_FEATURE_ID,
        key: FeatureFlag.Staff,
        type: 'PERMISSION'
      },
      {
        id: STAFF_PICK_FEATURE_ID,
        key: FeatureFlag.StaffPick,
        type: 'MODE'
      },
      {
        id: 'd3f3e067-5624-4119-83d6-968b6d1621af',
        key: FeatureFlag.Flagged,
        type: 'PERMISSION'
      },
      {
        id: '8ed8b26a-279d-4111-9d39-a40164b273a0',
        key: FeatureFlag.Suspended,
        type: 'PERMISSION'
      },
      {
        id: '6e9aacf3-7b83-4009-9c51-0612042b4af2',
        key: FeatureFlag.LensTeam,
        type: 'COHORT'
      }
    ]
  });

  return featureFlags.count;
};

export default seedFeatureFlags;
