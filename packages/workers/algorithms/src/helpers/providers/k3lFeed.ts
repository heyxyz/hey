const k3lFeed = async (strategy: string, limit: string, offset: string) => {
  try {
    const response = await fetch(
      `https://lens-api.k3l.io/feed/${strategy}?limit=${limit}&offset=${offset}`,
      { headers: { 'User-Agent': 'Lenster' } }
    );
    console.log(
      `https://lens-api.k3l.io/feed/${strategy}?limit=${limit}&offset=${offset}`
    );
    const json: {
      postId: string;
    }[] = await response.json();
    const postIds = json.map((item: any) => item.postId);

    return postIds;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default k3lFeed;
