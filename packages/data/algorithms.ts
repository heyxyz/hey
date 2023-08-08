import { STATIC_IMAGES_URL } from './constants';
import { HomeFeedType } from './enums';

export const algorithms: {
  name: string;
  feedType: HomeFeedType;
  description: string;
  image: string;
  by: string;
}[] = [
  {
    name: 'Most Viewed',
    feedType: HomeFeedType.LENSTER_MOSTVIEWED,
    description:
      'Most viewed posts sorted by the number of views in the last 24 hours in Lenster.',
    image: `${STATIC_IMAGES_URL}/algorithms/lenster-mostviewed.png`,
    by: 'Lenster'
  },
  {
    name: 'Most Interacted',
    feedType: HomeFeedType.LENSTER_MOSTINTERACTED,
    description:
      'Most interacted posts sorted by the number of interactions in the last 24 hours in Lenster.',
    image: `${STATIC_IMAGES_URL}/algorithms/lenster-mostinteracted.png`,
    by: 'Lenster'
  },
  {
    name: 'Recommended',
    feedType: HomeFeedType.K3L_RECOMMENDED,
    description: 'New and interesting content powered by AI + EigenTrust.',
    image: `${STATIC_IMAGES_URL}/algorithms/k3l.png`,
    by: 'Karma3Labs'
  },
  {
    name: 'Popular',
    feedType: HomeFeedType.K3L_POPULAR,
    description: 'Posts sorted by top ranked profiles engagement.',
    image: `${STATIC_IMAGES_URL}/algorithms/k3l.png`,
    by: 'Karma3Labs'
  },
  {
    name: 'Recent',
    feedType: HomeFeedType.K3L_RECENT,
    description: 'Recent posts sorted by time of posting.',
    image: `${STATIC_IMAGES_URL}/algorithms/k3l.png`,
    by: 'Karma3Labs'
  },
  {
    name: 'Crowdsourced',
    feedType: HomeFeedType.K3L_CROWDSOURCED,
    description: 'Quality content decided by community engagement',
    image: `${STATIC_IMAGES_URL}/algorithms/k3l.png`,
    by: 'Karma3Labs'
  }
];
