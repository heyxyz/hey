import { PrismaClient } from '@prisma/client';

import seedAllowedTokens from './seeds/seedAllowedTokens';
import seedFeatureFlags from './seeds/seedFeatureFlags';
import seedMembershipNfts from './seeds/seedMembershipNfts';
import seedPolls from './seeds/seedPolls';
import seedPreferences from './seeds/seedPreferences';
import seedProfileFeatures from './seeds/seedProfileFeatures';

export const prisma = new PrismaClient();

async function main() {
  const featureFlags = await seedFeatureFlags();
  console.log(`Seeded ${featureFlags} feature flags`);

  const profileFeatures = await seedProfileFeatures();
  console.log(`Seeded ${profileFeatures} profile features`);

  const preferences = await seedPreferences();
  console.log(`Seeded ${preferences} preferences`);

  const allowedTokens = await seedAllowedTokens();
  console.log(`Seeded ${allowedTokens} allowed tokens`);

  const poll = await seedPolls();
  console.log(`Seeded ${poll} poll`);

  const membershipNft = await seedMembershipNfts();
  console.log(`Seeded ${membershipNft} membership nft`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
