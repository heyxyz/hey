const randomizeIds = (ids: string[]) => {
  return ids.sort(() => Math.random() - Math.random());
};

export default randomizeIds;
