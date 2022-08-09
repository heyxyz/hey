// @ts-ignore
import omitDeep from 'omit-deep';

const omit = (object: any, name: string) => {
  return omitDeep(object, name);
};

export default omit;
