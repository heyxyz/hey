/**
 * Randomize the order of the ids
 * @param ids The ids to randomize
 * @returns The randomized ids
 */
const randomizeIds = (ids: string[]) => {
  return ids.sort(() => Math.random() - Math.random());
};

export default randomizeIds;
