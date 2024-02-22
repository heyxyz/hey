import { prisma } from '../seed';

const seedFeatureFlags = async (): Promise<number> => {
  const featureFlags = await prisma.feature.createMany({
    data: [
      {
        id: '0a441129-182a-4a3f-83cf-a13c5ad8282b',
        key: 'gardener',
        type: 'PERMISSION'
      },
      {
        id: '0e588583-b347-4752-9e1e-0ad4128348e8',
        key: 'staff-mode',
        type: 'MODE'
      },
      {
        id: '8ed8b26a-279d-4111-9d39-a40164b273a0',
        key: 'suspended',
        type: 'PERMISSION'
      },
      {
        id: '9f66a465-e1d7-4123-b329-ddd14fd85510',
        key: 'gardener-mode',
        type: 'MODE'
      },
      {
        id: 'a0d6d247-50ef-419f-a045-54fa96054922',
        key: 'verified',
        type: 'PERMISSION'
      },
      {
        id: 'd3f3e067-5624-4119-83d6-968b6d1621af',
        key: 'flagged',
        type: 'PERMISSION'
      },
      {
        id: 'eea3b2d2-a60c-4e41-8130-1cb34cc37810',
        key: 'staff',
        type: 'PERMISSION'
      }
    ]
  });

  return featureFlags.count;
};

export default seedFeatureFlags;
