/**
 *
 * @param value - Value to trim
 * @returns trimmed value
 */
const trimify = (value: string): string =>
  value
    ?.replace(/\n\n\s*\n/g, '\n\n')
    .replace(/\n/gi, '\n <br />')
    .trim();

export default trimify;
