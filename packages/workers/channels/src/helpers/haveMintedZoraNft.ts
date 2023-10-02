const haveMintedZoraNft = async (
  by: `0x${string}`,
  contract: `0x${string}`
) => {
  const response = await fetch('https://api.zora.co/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-agent': 'Hey.xyz'
    },
    body: JSON.stringify({
      query: `
        query Mints {
          mints(
            where: {
              minterAddresses: "${by.toLowerCase()}",
              collectionAddresses: "${contract.toLowerCase()}"
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
