/**
 *
 * @param num number to split
 * @param parts number of parts to split the number into
 * @returns array of numbers
 */
const splitNumber = (num = 1, parts = 1) => {
  const n = Math.floor(num / parts);
  const numbers: number[] = [];
  for (let i = 0; i < parts; i++) {
    numbers.push(n);
  }
  if (numbers.reduce((a, b) => a + b, 0) === num) {
    return numbers;
  }
  for (let i = 0; i < parts; i++) {
    numbers[i]++;
    if (numbers.reduce((a, b) => a + b, 0) === num) {
      return numbers;
    }
  }

  return numbers;
};

export default splitNumber;
