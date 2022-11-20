/**
 *
 * @param number - Number to humanize
 * @returns humanized number
 */
const humanize = (number: number): string => number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export default humanize;
