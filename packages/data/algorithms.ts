import { STATIC_IMAGES_URL } from './constants';
import { HomeFeedType } from './enums';

export const algorithms: {
  by: string;
  description: string;
  feedType: HomeFeedType;
  image: string;
  isPersonalized?: boolean;
  name: string;
}[] = [
  {
    by: 'Hey',
    description:
      'Most viewed posts sorted by the number of views in the last 24 hours in Hey.',
    feedType: HomeFeedType.HEY_MOSTVIEWED,
    image: `${STATIC_IMAGES_URL}/algorithms/hey-mostviewed.png`,
    name: 'Most viewed'
  },
  {
    by: 'Hey',
    description:
      'Most interacted posts sorted by the number of interactions in the last 24 hours in Hey.',
    feedType: HomeFeedType.HEY_MOSTINTERACTED,
    image: `${STATIC_IMAGES_URL}/algorithms/hey-mostinteracted.png`,
    name: 'Most interacted'
  },
  {
    by: 'Karma3Labs',
    description: 'New and interesting content powered by AI + EigenTrust.',
    feedType: HomeFeedType.K3L_RECOMMENDED,
    image: `${STATIC_IMAGES_URL}/algorithms/k3l.png`,
    name: 'Recommended'
  },
  {
    by: 'Karma3Labs',
    description: 'Posts sorted by top ranked profiles engagement.',
    feedType: HomeFeedType.K3L_POPULAR,
    image: `${STATIC_IMAGES_URL}/algorithms/k3l.png`,
    name: 'Popular'
  },
  {
    by: 'Karma3Labs',
    description: 'Recent posts sorted by time of posting.',
    feedType: HomeFeedType.K3L_RECENT,
    image: `${STATIC_IMAGES_URL}/algorithms/k3l.png`,
    name: 'Recent'
  },
  {
    by: 'Karma3Labs',
    description: 'Quality content decided by community engagement',
    feedType: HomeFeedType.K3L_CROWDSOURCED,
    image: `${STATIC_IMAGES_URL}/algorithms/k3l.png`,
    name: 'Crowdsourced'
  },
  {
    by: 'Karma3Labs',
    description: 'Personalized feed based on who you follow.',
    feedType: HomeFeedType.K3L_FOLLOWING,
    image: `${STATIC_IMAGES_URL}/algorithms/k3l.png`,
    isPersonalized: true,
    name: 'Following'
  }
];
