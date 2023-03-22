/**
 * Splits an array into smaller arrays of a specified chunk size.
 *
 * @param arr The array to chunk.
 * @param chunkSize The size of each chunk.
 * @returns An array of chunks.
 * @template T The type of elements in the array.
 */
const chunkArray = <T>(arr: T[], chunkSize: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    out.push(chunk);
  }

  return out;
};

export default chunkArray;
