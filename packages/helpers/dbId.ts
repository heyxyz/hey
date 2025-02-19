const dbId = (id: string) => {
  return `\\x${BigInt(id).toString(16)}`;
};

export default dbId;
