/**
 * Humanize the given number
 * @param number - URL which need to be CDNified
 * @returns the humanized number
 */
export const humanize = (number: number) =>
  number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
