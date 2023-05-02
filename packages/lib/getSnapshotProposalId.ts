/**
 * Get Snapshot proposal ID from URL
 * @param url Snapshot proposal URL
 * @returns Snapshot proposal ID
 */
const getSnapshotProposalId = (url: string[]): string | null => {
  const snapshotUrl = url.find((url) => url.includes('snapshot.org/#/'));

  if (!snapshotUrl) {
    return null;
  }

  try {
    const parsedUrl = new URL(snapshotUrl);
    if (parsedUrl.host !== 'snapshot.org') {
      return null;
    }
    const proposalId = parsedUrl.hash.match(/\/proposal\/(0x[\dA-Fa-f]{64})/);

    return proposalId?.[1] || null;
  } catch {
    return null;
  }
};

export default getSnapshotProposalId;
