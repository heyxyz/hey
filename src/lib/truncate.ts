export default function truncate(str: string | undefined, length: number): string | undefined {
  if (!str) {
    return str;
  }
  if (str.length > length) {
    return `${str.substring(0, length - 3)}...`;
  }
  return str;
}
