/**
 * Returns the specified number as a string with commas added to separate groups of three digits.
 *
 * @param number The number to humanize.
 * @returns The humanized number as a string.
 */
const humanize = (number: number): string => {
  if (typeof number !== "number" || Number.isNaN(number)) {
    return "";
  }

  return number.toLocaleString();
};

export default humanize;
