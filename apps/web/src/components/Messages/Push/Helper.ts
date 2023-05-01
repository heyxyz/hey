export const getProfileFromDID = (did: string) => {
  return did.split(':').slice(-2, -1)[0];
};
