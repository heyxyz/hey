import { privateKeyToAccount } from 'viem/accounts';

/**
 * Generate a snapshot account from the given parameters.
 * @param ownedBy Address of the current owner of the profile.
 * @param profileId ID of the profile.
 * @param snapshotId ID of the snapshot.
 * @param hash SHA-256 hash of for encryption.
 * @returns The generated snapshot account.
 */
const generateSnapshotAccount = async ({
  ownedBy,
  profileId,
  snapshotId,
  hash
}: {
  ownedBy: string;
  profileId: string;
  snapshotId: string;
  hash: string;
}): Promise<string> => {
  const seed = `${ownedBy}${profileId}${snapshotId}${hash}`;
  const encodedSeed = new TextEncoder().encode(seed);
  const digest = await crypto.subtle.digest({ name: 'SHA-256' }, encodedSeed);
  const privateKey = [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  const { address } = privateKeyToAccount(`0x${privateKey}`);

  return address;
};

export default generateSnapshotAccount;
