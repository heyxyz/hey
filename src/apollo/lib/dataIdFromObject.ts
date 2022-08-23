import { defaultDataIdFromObject } from '@apollo/client';

const dataIdFromObject = (res: any) => {
  const { id, collectedBy, createdAt, __typename }: any = res;
  switch (res.__typename) {
    case 'Post':
    case 'Comment':
      return `${__typename}:${id}${collectedBy ? `:Collect:${collectedBy?.address}` : ''}:${createdAt}`;
    default:
      return defaultDataIdFromObject(res);
  }
};

export default dataIdFromObject;
