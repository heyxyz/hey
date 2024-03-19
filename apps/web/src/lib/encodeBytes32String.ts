import { pad, toBytes, toHex } from 'viem';

export function encodeBytes32String(text: string): `0x${string}` {
  const bytes = toBytes(text);

  if (bytes.length > 31) {
    throw new Error('bytes32 string must be less than 32 bytes');
  }

  const padded = pad(bytes, { dir: 'right', size: 32 });

  return toHex(padded);
}

export default encodeBytes32String;
