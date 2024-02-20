import { PrismaClient } from '@prisma/client';

import seedAllowedTokens from './seeds/seedAllowedTokens';
import seedFeatureFlags from './seeds/seedFeatureFlags';
import seedPreference from './seeds/seedPreference';
import seedProfileFeatures from './seeds/seedProfileFeatures';

export const prisma = new PrismaClient();

async function main() {
  const featureFlags = await seedFeatureFlags();
  console.log(`Seeded ${featureFlags} feature flags`);
  const profileFeatures = await seedProfileFeatures();
  console.log(`Seeded ${profileFeatures} profile features`);
  const preferences = await seedPreference();
  console.log(`Seeded ${preferences} preferences`);
  const allowedTokens = await seedAllowedTokens();
  console.log(`Seeded ${allowedTokens} allowed tokens`);
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
