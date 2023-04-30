import jwt from '@tsndr/cloudflare-worker-jwt';
import { privateKeyToAccount } from 'viem/accounts';

const getAccount = async (
  token: string,
  profileId: string,
  hash: string
): Promise<{
  privateKey: string;
  address: string;
}> => {
  const { payload } = jwt.decode(token);
  const seed = `${payload.id}${profileId}${hash}`;
  const encodedSeed = new TextEncoder().encode(seed);
  const digest = await crypto.subtle.digest({ name: 'SHA-256' }, encodedSeed);
  const privateKey = [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  const { address } = privateKeyToAccount(`0x${privateKey}`);

  return { privateKey, address };
};

export default getAccount;
