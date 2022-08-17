import humanize from './humanize';

/**
 *
 * @param num - Number to humanize
 * @param digits - Number of digits to show
 * @returns humanized number
 */
const nFormatter = (num: number, digits = 1): string => {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' }
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });

  return item
    ? num < 10000
      ? humanize(num)
      : (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol
    : '0';
};

export default nFormatter;
