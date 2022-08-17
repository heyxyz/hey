// @ts-ignore
import omitDeep from 'omit-deep';

/**
 *
 * @param object - Object to remove properties from
 * @param name - Name of property to remove
 * @returns object with property removed
 */
const omit = (object: any, name: string) => {
  return omitDeep(object, name);
};

export default omit;
