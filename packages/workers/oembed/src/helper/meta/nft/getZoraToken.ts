import type { NetworkInput, Token } from '@lenster/zora';
import { TokenDocument } from '@lenster/zora';
import { zoraApolloClient } from '@lenster/zora/apollo';

const getZoraToken = async (
  network: NetworkInput,
  contract: string,
  token: string
): Promise<Token | null> => {
  try {
    const response = await zoraApolloClient.query({
      query: TokenDocument,
      variables: {
        token: { address: contract, tokenId: token },
        network
      }
    });

    return response.data.token?.token;
  } catch {
    return null;
  }
};

export default getZoraToken;
