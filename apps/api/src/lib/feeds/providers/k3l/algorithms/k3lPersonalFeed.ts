import randomizeIds from 'src/lib/feeds/randomizeIds';
import urlcat from 'urlcat';

const k3lPersonalFeed = async (
  strategy: string,
  profile: string,
  limit: number,
  offset: number
) => {
  try {
    const response = await fetch(
      urlcat('https://lens-api.k3l.io/feed/personal/:profile/:strategy', {
        limit,
        offset,
        profile,
        strategy
      }),
      { headers: { 'User-Agent': 'Hey.xyz' } }
    );
    const json: {
      postId: string;
    }[] = await response.json();
    const ids = json.map((item: any) => item.postId);

    return randomizeIds(ids);
  } catch {
    return [];
  }
};

export default k3lPersonalFeed;
