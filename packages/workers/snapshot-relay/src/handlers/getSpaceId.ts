import { SpaceDocument } from '../../generated';
import client from '../apollo/client';

export default async (network: 'mainnet' | 'testnet' | string, id: string) => {
  try {
    const apolloClient = client(network === 'mainnet');
    const { data } = await apolloClient.query({
      query: SpaceDocument,
      variables: { id }
    });

    if (data.proposal) {
      return new Response(
        JSON.stringify({ success: true, spaceId: data.proposal.space.id })
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Invalid proposal id!' })
    );
  } catch (error) {
    console.error('Failed to get space id', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Something went wrong!' })
    );
  }
};
