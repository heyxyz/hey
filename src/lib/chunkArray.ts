const chunkArray = <T>(arr: T[], chunkSize: number): Array<T[]> => {
  const out: Array<T[]> = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    out.push(chunk);
  }

  return out;
};

export default chunkArray;
