import { defaultDataIdFromObject } from '@apollo/client';

const dataIdFromObject = (res: any) => {
  const { id, collectedBy, __typename }: any = res;
  switch (res.__typename) {
    case 'Post':
    case 'Comment':
      return `${__typename}:${id}${collectedBy ? `:Collect:${collectedBy?.address}` : ''}`;
    default:
      return defaultDataIdFromObject(res);
  }
};

export default dataIdFromObject;
