export type DeepHashChunk = Uint8Array | AsyncIterable<Buffer> | DeepHashChunks;
export type DeepHashChunks = DeepHashChunk[];

export const deepHash = async (data: DeepHashChunk): Promise<Uint8Array> => {
  if (
    // @ts-expect-error
    typeof data[Symbol.asyncIterator as keyof AsyncIterable<Buffer>] ===
    'function'
  ) {
    const _data = data as AsyncIterable<Buffer>;
    let length = 0;

    for await (const chunk of _data) {
      length += chunk.byteLength;
    }

    const tag = Buffer.concat([
      Buffer.from('blob', 'utf-8'),
      Buffer.from(length.toString(), 'utf-8')
    ]);
    const taggedHash = Buffer.concat([
      Buffer.from(await crypto.subtle.digest('SHA-384', tag))
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
};

const deepHashChunks = async (
  chunks: DeepHashChunks,
  acc: Uint8Array
): Promise<Uint8Array> => {
  if (chunks.length < 1) {
    return acc;
  }

  const hashPair = Buffer.concat([acc, await deepHash(chunks[0])]);
  const newAcc = Buffer.from(await crypto.subtle.digest('SHA-384', hashPair));
  return await deepHashChunks(chunks.slice(1), newAcc);
};

export default deepHash;
