const checkEventExistence = (obj: any, event: string): boolean => {
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      if (checkEventExistence(obj[key], event)) {
        return true;
      }
    } else if (obj[key] === event) {
      return true;
    }
  }
  return false;
};

export default checkEventExistence;
