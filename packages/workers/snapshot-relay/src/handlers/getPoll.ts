import { SnapshotDocument } from 'snapshot';
import { webClient } from 'snapshot/apollo';

export default async (id: string, voter: string) => {
  try {
    const { data } = await webClient.query({
      query: SnapshotDocument,
      variables: { id, where: { voter, proposal: id } }
    });

    return new Response(JSON.stringify({ success: data }));
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: 'Something went wrong!' })
    );
  }
};
