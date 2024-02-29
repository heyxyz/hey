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
      { id: GARDENER_FEATURE_ID, key: 'gardener', type: 'PERMISSION' },
      { id: STAFF_MODE_FEATURE_ID, key: 'staff-mode', type: 'MODE' },
      { id: GARDENER_MODE_FEATURE_ID, key: 'gardener-mode', type: 'MODE' },
      { id: VERIFIED_FEATURE_ID, key: 'verified', type: 'PERMISSION' },
      { id: STAFF_FEATURE_ID, key: 'staff', type: 'PERMISSION' },
      { id: STAFF_PICK_FEATURE_ID, key: 'staff-pick', type: 'MODE' },
      {
        id: 'd3f3e067-5624-4119-83d6-968b6d1621af',
        key: 'flagged',
        type: 'PERMISSION'
      },
      {
        id: '8ed8b26a-279d-4111-9d39-a40164b273a0',
        key: 'suspended',
        type: 'PERMISSION'
      }
    ]
  });

  return featureFlags.count;
};

export default seedFeatureFlags;
