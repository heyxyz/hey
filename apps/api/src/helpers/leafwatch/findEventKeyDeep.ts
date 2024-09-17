const findEventKeyDeep = (obj: any, target: string): null | string => {
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string" && value === target) {
      return key;
    }

    if (typeof value === "object" && value !== null) {
      const result = findEventKeyDeep(value, target);
      if (result) {
        return result;
      }
    }
  }

  return null;
};

export default findEventKeyDeep;
