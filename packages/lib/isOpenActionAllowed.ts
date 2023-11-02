import type { Maybe, OpenActionModule } from '@hey/lens';

const allowedTypes = [
  'LegacySimpleCollectModule',
  'LegacyMultirecipientFeeCollectModule',
  'SimpleCollectOpenActionModule',
  'MultirecipientFeeCollectOpenActionModule',
  'UnknownOpenActionModule'
];

const isOpenActionAllowed = (
  openActions?: Maybe<OpenActionModule[]>
): boolean => {
  if (!openActions?.length) {
    return false;
  }

  return openActions.some((openAction) => {
    const { type } = openAction;

    return allowedTypes.includes(type);
  });
};

export default isOpenActionAllowed;
