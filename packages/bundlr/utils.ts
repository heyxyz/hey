import deepHash from './deephash';
import type { DataItem, EthereumSigner } from './index';

const map = {
  sha256: 'SHA-256',
  sha384: 'SHA-384'
};

for (const [k, v] of Object.entries(map)) {
  // @ts-expect-error
  map[v] = k;
}

export const getSignatureAndId = async (
  item: DataItem,
  signer: EthereumSigner
): Promise<{ signature: Buffer; id: Buffer }> => {
  const signatureData = await getSignatureData(item);
  const signatureBytes = await signer.sign(signatureData);
  const idBytes = await crypto.subtle.digest('SHA-256', signatureBytes);

  return { signature: Buffer.from(signatureBytes), id: Buffer.from(idBytes) };
};

export const sign = async (
  item: DataItem,
  signer: EthereumSigner
): Promise<Buffer> => {
  const { signature, id } = await getSignatureAndId(item, signer);
  item.getRaw().set(signature, 2);
  return id;
};

export const getSignatureData = (item: DataItem): Promise<Uint8Array> => {
  return deepHash([
    Buffer.from('dataitem', 'utf-8'),
    Buffer.from('1', 'utf-8'),
    Buffer.from(item.signatureType.toString(), 'utf-8'),
    item.rawOwner,
    item.rawTarget,
    item.rawAnchor,
    item.rawTags,
    item.rawData
  ]);
};

const shimClass = class {
  context = [];
  // @ts-expect-error
  constructor(private algo) {
    this.context = [];
  }

  update(data: Buffer) {
    // @ts-expect-error
    this.context.push(data);
    return this;
  }

  async digest() {
    return Buffer.from(
      await crypto.subtle.digest(this.algo, Buffer.concat(this.context))
    );
  }
};

export const getShim = (algo: string) => {
  // @ts-expect-error
  algo = algo.includes('-') ? algo : (algo = map[algo]);
  return new shimClass(algo);
};

export const byteArrayToLong = (byteArray: Uint8Array): number => {
  let value = 0;
  for (let i = byteArray.length - 1; i >= 0; i--) {
    value = value * 256 + byteArray[i];
  }
  return value;
};

export const longTo8ByteArray = (long: number): Uint8Array => {
  // we want to represent the input as a 8-bytes array
  const byteArray = [0, 0, 0, 0, 0, 0, 0, 0];

  for (let index = 0; index < byteArray.length; index++) {
    const byte = long & 0xff;
    byteArray[index] = byte;
    long = (long - byte) / 256;
  }

  return Uint8Array.from(byteArray);
};

export const shortTo2ByteArray = (long: number): Uint8Array => {
  if (long > (2 ^ (32 - 1))) {
    throw new Error('Short too long');
  }
  // we want to represent the input as a 8-bytes array
  const byteArray = [0, 0];

  for (let index = 0; index < byteArray.length; index++) {
    const byte = long & 0xff;
    byteArray[index] = byte;
    long = (long - byte) / 256;
  }

  return Uint8Array.from(byteArray);
};

// taken from AVSC - Tap.prototype.writeLong
const encodeLong = (n: number): Buffer => {
  let buf = Buffer.alloc(0);
  let f, m;
  let offset = 0;

  if (n >= -1073741824 && n < 1073741824) {
    // Won't overflow, we can use integer arithmetic.
    m = n >= 0 ? n << 1 : (~n << 1) | 1;
    do {
      buf = Buffer.concat([buf, Buffer.alloc(1)]);
      buf[offset] = m & 0x7f;
      m >>= 7;
    } while (m && (buf[offset++] |= 0x80));
  } else {
    // We have to use slower floating arithmetic.
    f = n >= 0 ? n * 2 : -n * 2 - 1;
    do {
      buf = Buffer.concat([buf, Buffer.alloc(1)]);
      buf[offset] = f & 0x7f;
      f /= 128;
    } while (f >= 1 && (buf[offset++] |= 0x80));
  }
  return buf;
};

export const serializeTags = (
  tags?: { name: string; value: string }[]
): Buffer => {
  let byt = Buffer.from('');
  if (!tags) {
    return byt;
  }
  // number of tags
  byt = Buffer.concat([byt, encodeLong(tags.length)]);
  for (const tag of tags) {
    if (tag?.name === undefined || tag?.value === undefined) {
      throw new Error(
        `Invalid tag format for ${tag}, expected {name:string, value: string}`
      );
    }
    const name = Buffer.from(tag.name);
    const value = Buffer.from(tag.value);
    // encode the length of the field using variable integer encoding
    byt = Buffer.concat([byt, encodeLong(name.byteLength)]);
    // then the value
    byt = Buffer.concat([byt, name]);
    byt = Buffer.concat([byt, encodeLong(value.byteLength)]);
    byt = Buffer.concat([byt, value]);
  }
  // 0 terminator
  byt = Buffer.concat([byt, encodeLong(0)]);
  return byt;
};
