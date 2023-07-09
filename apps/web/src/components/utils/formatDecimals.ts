export const formatDecimals = (value: number, decimals: number) => {
  return parseFloat(value.toFixed(decimals)).toString();
};
