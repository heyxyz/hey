/**
 * Generates a random number between the specified range.
 * @param min The minimum value (inclusive).
 * @param max The maximum value (exclusive).
 * @returns A random number between the specified range.
 */
const randomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min) + min);
};

export default randomNumber;
