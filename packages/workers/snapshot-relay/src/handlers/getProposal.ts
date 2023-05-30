import { SnapshotDocument } from '../../generated';
import client from '../apollo/client';

export default async (
  network: 'mainnet' | 'testnet' | string,
  id: string,
  voter: string
) => {
  try {
    const apolloClient = client(network === 'mainnet');
    const { data } = await apolloClient.query({
      query: SnapshotDocument,
      fetchPolicy: 'no-cache',
      variables: { id, where: { voter, proposal: id } }
    });

    const response = new Response(
      JSON.stringify({ success: true, poll: data })
    );

    // Disable caching because the poll data is dynamic and changes frequently because of live polling.
    response.headers.set('Cache-Control', 'no-store');

    return response;
  } catch (error) {
    console.error('Failed to get proposal', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Something went wrong!' })
    );
  }
};
