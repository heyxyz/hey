import { TEST_WALLET_ADDRESS } from '@hey/data/constants';

import { prisma } from '../seed';

const seedMembershipNfts = async (): Promise<number> => {
  const membershipNfts = await prisma.membershipNft.createMany({
    data: [{ dismissedOrMinted: true, id: TEST_WALLET_ADDRESS }]
  });

  return membershipNfts.count;
};

export default seedMembershipNfts;
