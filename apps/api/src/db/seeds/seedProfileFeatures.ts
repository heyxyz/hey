import { TEST_LENS_ID } from '@hey/data/constants';

import {
  GARDENER_FEATURE_ID,
  STAFF_FEATURE_ID,
  STAFF_PICK_FEATURE_ID,
  VERIFIED_FEATURE_ID
} from '../../lib/constants';
import { prisma } from '../seed';

const seedProfileFeatures = async (): Promise<number> => {
  const profileIds = ['0x0d', '0x06', '0x01', '0x02', '0x03', TEST_LENS_ID];

  const data = profileIds.map((profileId) => {
    return [
      { featureId: VERIFIED_FEATURE_ID, profileId },
      { featureId: STAFF_FEATURE_ID, profileId },
      { featureId: GARDENER_FEATURE_ID, profileId },
      { featureId: STAFF_PICK_FEATURE_ID, profileId }
    ];
  });

  const profileFeatures = await prisma.profileFeature.createMany({
    data: data.flat()
  });

  return profileFeatures.count;
};

export default seedProfileFeatures;
