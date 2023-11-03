export const profilesManagedKeyFields = (profilesManaged: any): string => {
  return `${profilesManaged.__typename}:${profilesManaged.address}`;
};
