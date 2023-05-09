import { SNAPSHOT_URL } from 'data';

/**
 * Get Snapshot proposal ID from URL
 * @param url Snapshot proposal URL
 * @returns Snapshot proposal ID
 */
const getSnapshotProposalId = (url: string[]): string | null => {
  const snapshotHost = SNAPSHOT_URL.replace('https://', '');
  const snapshotUrl = url.find((url) => url.includes(`${snapshotHost}/#/`));

  if (!snapshotUrl) {
    return null;
  }

  try {
    const parsedUrl = new URL(snapshotUrl);
    if (parsedUrl.host !== snapshotHost) {
      return null;
    }
    const proposalId = parsedUrl.hash.match(/\/proposal\/(0x[\dA-Fa-f]{64})/);

    return proposalId?.[1] || null;
  } catch {
    return null;
  }
};

export default getSnapshotProposalId;
