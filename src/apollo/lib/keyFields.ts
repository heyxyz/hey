export const publicationKeyFields = (publication: any) => {
  return `${publication.__typename}:${JSON.stringify({
    id: publication.id,
    collectedBy: publication.collectedBy?.address,
    createdAt: publication.createdAt
  })}`;
};
