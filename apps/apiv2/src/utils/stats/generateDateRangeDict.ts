const generateDateRangeDict = (): { [key: string]: number } => {
  let date = new Date();
  date.setFullYear(date.getFullYear() - 1);

  let dates: { [key: string]: number } = {};
  while (date < new Date()) {
    let dateString = date.toISOString().split('T')[0];
    dates[dateString] = 0;
    date.setDate(date.getDate() + 1);
  }

  return dates;
};

export default generateDateRangeDict;
