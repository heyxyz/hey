const haveMintedZoraNft = async (by: string, contract: string) => {
  const response = await fetch('https://api.zora.co/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-agent': 'Lenster'
    },
    body: JSON.stringify({
      query: `
          query Mints {
            mints(
              where: {
                minterAddresses: "${by}",
                collectionAddresses: "${contract}"
              }
              networks: {network: ZORA, chain: ZORA_MAINNET}
            ) {
              nodes {
                mint {
                  tokenId
                }
              }
            }
          }
        `
    })
  });

  const json: { data: { mints: { nodes: { mint: { tokenId: string } }[] } } } =
    await response.json();

  const isMember = json.data.mints.nodes.length > 0;

  return isMember;
};

export default haveMintedZoraNft;
