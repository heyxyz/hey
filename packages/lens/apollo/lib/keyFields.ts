/**
 * Returns the key fields of a publication.
 *
 * @param publication The publication to get the key fields from.
 * @returns The key fields of the publication.
 */
export const publicationKeyFields = (publication: any): string => {
  return `${publication.__typename}:${JSON.stringify({
    id: publication.id,
    createdAt: publication.createdAt
  })}`;
};

export const profilesManagedKeyFields = (profilesManaged: any): string => {
  return `${profilesManaged.__typename}:${profilesManaged.address}`;
};
