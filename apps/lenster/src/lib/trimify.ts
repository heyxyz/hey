/**
 *
 * @param value - Value to trim
 * @returns trimmed value
 */
const trimify = (value: string): string => value?.replace(/\n\s*\n/g, '\n\n').trim();

export default trimify;
