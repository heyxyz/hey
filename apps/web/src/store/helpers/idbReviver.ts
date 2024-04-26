const idbReviver = (_key: string, value: any) => {
  if (typeof value === 'object' && value !== null && value.dataType === 'Map') {
    return new Map(value.value);
  }

  return value;
};

export default idbReviver;
