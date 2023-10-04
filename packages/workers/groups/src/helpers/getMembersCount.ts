const getMembersCount = async (contract: `0x${string}`) => {
  const response = await fetch('https://api.zora.co/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-agent': 'Hey.xyz'
    },
    body: JSON.stringify({
      query: `
        query AggregateStat {
          aggregateStat {
            ownerCount(
              where: {collectionAddresses: "${contract.toLowerCase()}"}
              networks: {network: ZORA, chain: ZORA_MAINNET}
            )
          }
        }
      `
    })
  });

  const json: { data: { aggregateStat: { ownerCount: number } } } =
    await response.json();

  return json.data.aggregateStat.ownerCount || 0;
};

export default getMembersCount;
