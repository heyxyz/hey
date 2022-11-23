/**
 *
 * @param str - String to convert to snake case
 * @returns snake case string
 */
const toSnakeCase = (str: string) => {
  return str
    .replace(/\W+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map((word) => word.toLowerCase())
    .join('_');
};

export default toSnakeCase;
