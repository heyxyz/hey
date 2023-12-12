const generateDateRangeDict = (): { [key: string]: number } => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 1);

  const dates: { [key: string]: number } = {};
  while (date < new Date()) {
    const dateString = date.toISOString().split("T")[0];
    dates[dateString] = 0;
    date.setDate(date.getDate() + 1);
  }

  return dates;
};

export default generateDateRangeDict;
