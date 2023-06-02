/**
 * Returns true if the current month is June.
 *
 * @returns {boolean} True if the current month is June.
 */
const isPrimeMonth = () => {
  const today = new Date();
  const month = today.getMonth();

  return month === 5;
};

export default isPrimeMonth;
