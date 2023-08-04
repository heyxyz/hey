import type { K3lFeedType } from '@lenster/types/algorithms';
import axios from 'axios';

const k3lFeed = async (type: K3lFeedType) => {
  try {
    const response = await axios(
      `https://lens-api.k3l.io/feed/${type}?limit=50`
    );

    const postIds = response.data.map((item: any) => item.postId);

    return postIds;
  } catch {
    return [];
  }
};

export default k3lFeed;
