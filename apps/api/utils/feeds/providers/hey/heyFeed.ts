import heyMostInteracted from './algorithms/heyMostInteracted';
import heyMostViewed from './algorithms/heyMostViewed';

const heyFeed = async (strategy: string, limit: number, offset: number) => {
  switch (strategy) {
    case 'mostviewed':
      return await heyMostViewed(limit, offset);
    case 'mostinteracted':
      return await heyMostInteracted(limit, offset);
    default:
      return [];
  }
};

export default heyFeed;
