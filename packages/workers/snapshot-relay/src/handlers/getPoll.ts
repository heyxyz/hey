import { SnapshotDocument } from 'snapshot';
import { webClient } from 'snapshot/apollo';

export default async (id: string) => {
  try {
    const { data } = await webClient.query({
      query: SnapshotDocument,
      variables: {
        id,
        where: {
          voter: '0x3A5bd1E37b099aE3386D13947b6a90d97675e5e3',
          proposal: id
        }
      }
    });
    return new Response(JSON.stringify({ success: data }));
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: 'Something went wrong!' })
    );
  }
};
