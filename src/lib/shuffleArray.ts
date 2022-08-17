/**
 *
 * @param array - Array to shuffle
 * @returns shuffled array
 */
const shuffleArray = (array: any[]) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

export default shuffleArray;
