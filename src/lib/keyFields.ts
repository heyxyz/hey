/**
 *
 * @param publication The publication to get the key fields from.
 * @returns key fields of the publication.
 */
export const publicationKeyFields = (publication: any) => {
  return `${publication.__typename}:${JSON.stringify({
    id: publication.id,
    collectedBy: publication.collectedBy?.address,
    createdAt: publication.createdAt
  })}`;
};
