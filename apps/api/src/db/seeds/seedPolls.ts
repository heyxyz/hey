import { TEST_LENS_ID } from '@hey/data/constants';

import { prisma } from '../seed';

const seedPolls = async (): Promise<number> => {
  const poll = await prisma.poll.create({
    data: { id: '0bc7fc23-fe6d-467f-b375-044c6cc1ad27' }
  });

  const option = await prisma.pollOption.create({
    data: {
      option: 'Yes',
      pollId: '0bc7fc23-fe6d-467f-b375-044c6cc1ad27'
    }
  });

  await prisma.pollOption.create({
    data: {
      option: 'No',
      pollId: '0bc7fc23-fe6d-467f-b375-044c6cc1ad27'
    }
  });

  await prisma.pollResponse.create({
    data: {
      id: poll.id,
      optionId: option.id,
      profileId: TEST_LENS_ID
    }
  });

  return 1;
};

export default seedPolls;
