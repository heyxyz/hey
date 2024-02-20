import { ApolloClient, from, HttpLink, InMemoryCache } from '@apollo/client';
import {
  TEST_LENS_ID,
  TEST_PK,
  TEST_WALLET_ADDRESS
} from '@hey/data/constants';
import LensEndpoint from '@hey/data/lens-endpoints';
import { AuthenticateDocument, ChallengeDocument } from '@hey/lens';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { polygonMumbai } from 'viem/chains';

const httpLink = new HttpLink({
  fetch,
  fetchOptions: 'no-cors',
  uri: LensEndpoint.Testnet
});

const apolloClient = () =>
  new ApolloClient({
    cache: new InMemoryCache({}),
    link: from([httpLink])
  });

const getAuthApiHeadersForTest = async () => {
  const account = privateKeyToAccount(TEST_PK);
  const client = createWalletClient({
    account,
    chain: polygonMumbai,
    transport: http()
  });

  // Get challenge
  const { data: challenge } = await apolloClient().query({
    query: ChallengeDocument,
    variables: { request: { for: TEST_LENS_ID, signedBy: TEST_WALLET_ADDRESS } }
  });

  if (!challenge?.challenge?.text) {
    throw new Error('Challenge failed');
  }

  // Get signature
  const signature = await client.signMessage({
    message: challenge.challenge.text
  });

  // Auth user
  const { data: auth } = await apolloClient().mutate({
    mutation: AuthenticateDocument,
    variables: { request: { id: challenge.challenge.id, signature } }
  });

  const accessToken = auth?.authenticate.accessToken;

  return { 'X-Access-Token': accessToken, 'X-Lens-Network': 'testnet' };
};

export default getAuthApiHeadersForTest;
