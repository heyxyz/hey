import { aaveMembers } from './aave-members';
import { lensterMembers } from './lenster-members';

export const featureFlags = [
  {
    key: 'messages',
    name: 'Messages',
    enabledFor: [
      ...lensterMembers,
      ...aaveMembers,
      '0x06', // wagmi.lens
      '0x2d', // sasicodes.lens
      '0xe248', // nick-molnar.lens
      '0x010e04', // elisealix22.lens
      '0x5cce', // saulmc.lens
      '0x014309', // iambhavya.lens
      '0x8539', // petermdenton.lens
      '0x013f9d', // shanemac.lens
      '0x015336', // jazzz.lens
      '0x010e75', // shash256.lens
      '0x010f89', // alohajha.lens
      '0x21ad' // galligan.lens
    ]
  },
  {
    key: 'composer-v2',
    name: 'Composer v2',
    enabledFor: [...lensterMembers]
  },
  {
    key: 'trending-widget',
    name: 'Trending widget',
    enabledFor: [...lensterMembers]
  },
  {
    key: 'timeline-v2',
    name: 'Timeline v2',
    enabledFor: [
      ...lensterMembers,
      '0x2d' // sasicodes.lens
    ]
  }
];
