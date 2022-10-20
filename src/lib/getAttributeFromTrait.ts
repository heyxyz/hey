import type { Attribute } from '@generated/types';

const getAttributeFromTrait = (attributes: Attribute[] | null | undefined, traitType: string) => {
  return attributes?.find((el) => el.traitType === traitType)?.value;
};

export default getAttributeFromTrait;
