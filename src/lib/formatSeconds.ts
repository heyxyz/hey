const getTimeFromSeconds = (seconds: string | undefined) => {
  if (!seconds) {
    return '';
  }
  const parsed = parseFloat(seconds);
  if (parsed < 3600) {
    return new Date(parsed * 1000)?.toISOString().slice(14, 19);
  }
  return new Date(parsed * 1000)?.toISOString().slice(11, 19);
};

export default getTimeFromSeconds;
