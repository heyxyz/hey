const getSnapshotProposalId = (url: string): string | null => {
  const regex = /^https:\/\/snapshot\.org\/#\/[\da-z]+\.eth\/proposal\/(0x[\dA-Fa-f]{64})$/;
  const match = url.match(regex);

  return match ? match[1] : null;
};

export default getSnapshotProposalId;
