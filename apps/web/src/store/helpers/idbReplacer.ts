const idbReplacer = (_key: string, value: any) => {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: [...value]
    };
  }

  return value;
};

export default idbReplacer;
