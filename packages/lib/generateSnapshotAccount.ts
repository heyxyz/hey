import { privateKeyToAccount } from 'viem/accounts';
// todo: import snapshotSecretBefore and snapshotSecretAfter. 
// Remove the proposalId and Address params when calling the generateSnapshotAccount

/**
 * Generate a snapshot account from the given parameters.
 * @param profileId ID of the profile.
 * @returns The generated snapshot account.
 */
const generateSnapshotAccount = async ({
  profileId
}: {
  profileId: string;
}): Promise<{
  address: string;
  privateKey: string;
}> => {
  const seed = `${snapshotSecretBefore}${profileId}${snapshotSecretAfter}`;
  const encodedSeed = new TextEncoder().encode(seed);
  const digest = await crypto.subtle.digest({ name: 'SHA-256' }, encodedSeed);
  const privateKey = [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  const { address } = privateKeyToAccount(`0x${privateKey}`);

  return { address, privateKey };
};

export default generateSnapshotAccount;
