import randomizeIds from '../../helpers/randomizeIds';

const k3lFeed = async (strategy: string, limit: number, offset: number) => {
  try {
    const response = await fetch(
      `https://lens-api.k3l.io/feed/${strategy}?limit=${limit}&offset=${offset}`,
      { headers: { 'User-Agent': 'Lenster' } }
    );
    const json: {
      postId: string;
    }[] = await response.json();
    const ids = json.map((item: any) => item.postId);

    return randomizeIds(ids);
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default k3lFeed;
