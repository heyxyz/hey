import { GARDENER, STAFFTOOLS } from '@hey/data/tracking';

const flattenObject = (obj: any): string[] => {
  let result: string[] = [];

  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      result = result.concat(flattenObject(obj[key]));
    } else {
      result.push(obj[key]);
    }
  }

  return result;
};

const auditableEvents = [
  ...flattenObject(GARDENER),
  ...flattenObject(STAFFTOOLS)
];

export default auditableEvents;
