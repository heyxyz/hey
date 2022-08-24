/**
 *
 * @param object - Object to remove properties from
 * @param name - Name of property to remove
 * @returns object with property removed
 */
const omit = (object: any, name: string) => {
  delete object[name];
  return object;
};

export default omit;
