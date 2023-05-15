import { SnapshotDocument } from 'snapshot';
import { webClient } from 'snapshot/apollo';

export default async (id: string) => {
  try {
    const { data } = await webClient.query({
      query: SnapshotDocument,
      variables: { id }
    });

    return new Response(JSON.stringify({ success: true, poll: data }));
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: 'Something went wrong!' })
    );
  }
};
