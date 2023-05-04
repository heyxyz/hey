import { privateKeyToAccount } from 'viem/accounts';

/**
 * Generate a snapshot account from the given parameters.
 * @param ownedBy Address of the current owner of the profile.
 * @param profileId ID of the profile.
 * @param snapshotId ID of the snapshot.
 * @returns The generated snapshot account.
 */
const generateSnapshotAccount = async ({
  ownedBy,
  profileId,
  snapshotId
}: {
  ownedBy: string;
  profileId: string;
  snapshotId: string;
}): Promise<{
  address: string;
  privateKey: string;
}> => {
  const seed = `${ownedBy}${profileId}${snapshotId}`;
  const encodedSeed = new TextEncoder().encode(seed);
  const digest = await crypto.subtle.digest({ name: 'SHA-256' }, encodedSeed);
  const privateKey = [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  const { address } = privateKeyToAccount(`0x${privateKey}`);

  return { address, privateKey };
};

export default generateSnapshotAccount;
