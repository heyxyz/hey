import { TEST_LENS_ID } from '@hey/data/constants';

import { prisma } from '../seed';

const seedPreferences = async (): Promise<number> => {
  const preferences = await prisma.preference.createMany({
    data: [
      {
        highSignalNotificationFilter: true,
        id: '0x0d',
        isPride: true
      },
      {
        highSignalNotificationFilter: true,
        id: '0x06',
        isPride: true
      },
      {
        highSignalNotificationFilter: true,
        id: TEST_LENS_ID,
        isPride: true
      }
    ]
  });

  return preferences.count;
};

export default seedPreferences;
