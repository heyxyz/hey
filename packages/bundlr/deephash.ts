import { getShim } from './utils';

export type DeepHashChunk = Uint8Array | AsyncIterable<Buffer> | DeepHashChunks;
export type DeepHashChunks = DeepHashChunk[];

export async function deepHash(data: DeepHashChunk): Promise<Uint8Array> {
  if (
    // @ts-ignore
    typeof data[Symbol.asyncIterator as keyof AsyncIterable<Buffer>] ===
    'function'
  ) {
    const _data = data as AsyncIterable<Buffer>;
    const context = getShim('sha384');

    let length = 0;

    for await (const chunk of _data) {
      length += chunk.byteLength;
      context.update(chunk);
    }

    const tag = Buffer.concat([
      Buffer.from('blob', 'utf-8'),
      Buffer.from(length.toString(), 'utf-8')
    ]);

    const taggedHash = Buffer.concat([
      Buffer.from(await crypto.subtle.digest('SHA-384', tag)),
      await context.digest()
    ]);
    return Buffer.from(await crypto.subtle.digest('SHA-384', taggedHash));
  } else if (Array.isArray(data)) {
    const tag = Buffer.concat([
      Buffer.from('list', 'utf-8'),
      Buffer.from(data.length.toString(), 'utf-8')
    ]);

    return await deepHashChunks(
      data,
      Buffer.from(await crypto.subtle.digest('SHA-384', tag))
    );
  }

  const _data = data as Uint8Array;

  const tag = Buffer.concat([
    Buffer.from('blob', 'utf-8'),
    Buffer.from(_data.byteLength.toString(), 'utf-8')
  ]);

  const taggedHash = Buffer.concat([
    Buffer.from(await crypto.subtle.digest('SHA-384', tag)),
    Buffer.from(await crypto.subtle.digest('SHA-384', _data))
  ]);

  return Buffer.from(await crypto.subtle.digest('SHA-384', taggedHash));
}

export async function deepHashChunks(
  chunks: DeepHashChunks,
  acc: Uint8Array
): Promise<Uint8Array> {
  if (chunks.length < 1) {
    return acc;
  }

  const hashPair = Buffer.concat([acc, await deepHash(chunks[0])]);
  const newAcc = Buffer.from(await crypto.subtle.digest('SHA-384', hashPair));
  return await deepHashChunks(chunks.slice(1), newAcc);
}

export async function hashStream(
  stream: AsyncIterable<Buffer>
): Promise<Buffer> {
  const context = getShim('sha384');

  for await (const chunk of stream) {
    context.update(chunk);
  }

  return await context.digest();
}

export default deepHash;
