import dayjs from 'dayjs';

const formatTime = (date: Date | undefined): string => {
  return date ? dayjs(date).format('h:mm A · MMM D, YYYY') : '';
};

export default formatTime;
