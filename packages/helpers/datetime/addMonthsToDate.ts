import dayjs from "dayjs";

const addMonthsToDate = (date: Date | string, months: number) => {
  return dayjs(new Date(date)).add(months, "month");
};

export default addMonthsToDate;
