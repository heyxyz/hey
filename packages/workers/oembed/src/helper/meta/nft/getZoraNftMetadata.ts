import type { ZoraNft } from '@lenster/types/zora-nft';

const getZoraNftMetadata = async (
  chain: string,
  contract: string,
  token?: string
): Promise<ZoraNft | null> => {
  try {
    const response = await fetch(
      `https://zora.co/api/personalize/collection/${chain}:${contract}/${token}`
    );
    const data: { collection: ZoraNft } = await response.json();

    return data.collection;
  } catch {
    return null;
  }
};

export default getZoraNftMetadata;
