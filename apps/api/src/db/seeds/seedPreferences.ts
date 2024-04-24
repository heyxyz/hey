import { TEST_LENS_ID } from '@hey/data/constants';

import { prisma } from '../seed';

const seedPreferences = async (): Promise<number> => {
  const preferences = await prisma.preference.createMany({
    data: [
      {
        appIcon: 1,
        highSignalNotificationFilter: true,
        id: '0x0d'
      },
      {
        appIcon: 1,
        highSignalNotificationFilter: true,
        id: '0x06'
      },
      {
        appIcon: 1,
        highSignalNotificationFilter: true,
        id: TEST_LENS_ID
      }
    ]
  });

  return preferences.count;
};

export default seedPreferences;
