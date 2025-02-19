const decimalToHex = (id: string) => {
  return BigInt(id).toString(16);
};

export default decimalToHex;
