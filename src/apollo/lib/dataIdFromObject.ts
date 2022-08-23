import { defaultDataIdFromObject } from '@apollo/client';

const dataIdFromObject = (res: any) => {
  const { id, collectedBy, mirrorOf }: any = res;
  switch (res.__typename) {
    case 'Post':
      return `Post:${id}${collectedBy ? `:collect:${collectedBy?.address}` : ''}`;
    case 'Comment':
      return `Comment:${id}${collectedBy ? `:collect:${collectedBy?.address}` : ''}`;
    case 'Mirror':
      return `Mirror:${id}:mirrorOf:${mirrorOf?.id}`;
    default:
      return defaultDataIdFromObject(res);
  }
};

export default dataIdFromObject;
