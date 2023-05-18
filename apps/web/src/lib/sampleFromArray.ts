/**
 * Takes a random sample of size `sampleSize` from the `array`
 *
 * @param array The array to sample from.
 * @param sampleSize The size of the sample to take.
 * @returns A subset of the array
 * @template T The type of elements in the array.
 */

const sampleFromArray = <T>(array: T[], sampleSize: number): T[] => {
  if (sampleSize > array.length) {
    throw new Error('sampleSize cannot be larger than the array length');
  }

  // copy array to avoid mutation
  const arrCopy = [...array];

  const result: T[] = [];

  for (let i = 0; i < sampleSize; i++) {
    const randomIndex = Math.floor(Math.random() * arrCopy.length);
    const [item] = arrCopy.splice(randomIndex, 1);
    result.push(item);
  }

  return result;
};

export default sampleFromArray;
