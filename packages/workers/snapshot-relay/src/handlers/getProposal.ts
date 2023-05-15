import { SnapshotDocument } from 'snapshot';
import { webClient } from 'snapshot/apollo';

export default async (id: string, voter: string) => {
  try {
    const { data } = await webClient.query({
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
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: 'Something went wrong!' })
    );
  }
};
