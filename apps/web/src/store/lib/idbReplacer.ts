const idbReplacer = (_key: String, value: any) => {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: [...value]
    };
  }

  return value;
};

export default idbReplacer;
